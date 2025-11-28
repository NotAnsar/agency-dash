// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Type definitions for CSV data
interface AgencyCSV {
	id: string;
	name: string;
	state: string;
	state_code: string;
	type: string;
	population: string;
	website: string;
	total_schools: string;
	total_students: string;
	mailing_address: string;
	grade_span: string;
	locale: string;
	csa_cbsa: string;
	domain_name: string;
	physical_address: string;
	phone: string;
	status: string;
	student_teacher_ratio: string;
	supervisory_union: string;
	county: string;
	created_at: string;
	updated_at: string;
}

interface ContactCSV {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	title: string;
	email_type: string;
	contact_form_url: string;
	department: string;
	agency_id: string;
	firm_id: string;
	created_at: string;
	updated_at: string;
}

// Simple CSV parser
function parseCSV<T>(content: string): T[] {
	const lines = content.split('\n').filter((line) => line.trim());
	if (lines.length === 0) return [];

	const headers = lines[0].split(',').map((h) => h.trim());
	const data: T[] = [];

	for (let i = 1; i < lines.length; i++) {
		const values = lines[i].split(',');
		const row: Record<string, string | null> = {};

		headers.forEach((header, index) => {
			const value = values[index]?.trim() || null;
			// Convert empty strings to null
			row[header] = value === '' ? null : value;
		});

		data.push(row as T);
	}

	return data;
}

// Helper to safely parse integers
function parseIntOrNull(value: string | null): number | null {
	if (!value) return null;
	const parsed = parseInt(value, 10);
	return isNaN(parsed) ? null : parsed;
}

// Helper to safely parse floats
function parseFloatOrNull(value: string | null): number | null {
	if (!value) return null;
	const parsed = parseFloat(value);
	return isNaN(parsed) ? null : parsed;
}

// Helper to safely parse dates
function parseDateOrNow(value: string | null): Date {
	if (!value) return new Date();
	const parsed = new Date(value);
	return isNaN(parsed.getTime()) ? new Date() : parsed;
}

async function main() {
	console.log('🌱 Starting seed...');

	// Read CSV files
	const agenciesPath = path.join(__dirname, 'data', 'agencies.csv');
	const contactsPath = path.join(__dirname, 'data', 'contacts.csv');

	console.log('📂 Reading CSV files...');

	const agenciesCSV = fs.readFileSync(agenciesPath, 'utf-8');
	const contactsCSV = fs.readFileSync(contactsPath, 'utf-8');

	const agenciesData = parseCSV<AgencyCSV>(agenciesCSV);
	const contactsData = parseCSV<ContactCSV>(contactsCSV);

	console.log(`Found ${agenciesData.length} agencies`);
	console.log(`Found ${contactsData.length} contacts`);

	// Clear existing data (skip if tables don't exist yet)
	console.log('🗑️  Clearing existing data...');
	try {
		await prisma.contactViewLog.deleteMany();
		await prisma.contact.deleteMany();
		await prisma.agency.deleteMany();
	} catch (error) {
		console.error(error);
		console.log('⚠️  Tables may not exist yet, skipping cleanup...');
	}

	// Seed agencies
	console.log('🏛️  Seeding agencies...');
	let agencyCount = 0;
	const agencyIds = new Set<string>();

	for (const agency of agenciesData) {
		await prisma.agency.create({
			data: {
				id: agency.id,
				name: agency.name,
				state: agency.state || null,
				state_code: agency.state_code || null,
				type: agency.type || null,
				population: parseIntOrNull(agency.population),
				website: agency.website || null,
				total_schools: parseIntOrNull(agency.total_schools),
				total_students: parseIntOrNull(agency.total_students),
				mailing_address: agency.mailing_address || null,
				grade_span: agency.grade_span || null,
				locale: agency.locale || null,
				csa_cbsa: agency.csa_cbsa || null,
				domain_name: agency.domain_name || null,
				physical_address: agency.physical_address || null,
				phone: agency.phone || null,
				status: agency.status || null,
				student_teacher_ratio: parseFloatOrNull(agency.student_teacher_ratio),
				supervisory_union: agency.supervisory_union || null,
				county: agency.county || null,
				created_at: parseDateOrNow(agency.created_at),
				updated_at: parseDateOrNow(agency.updated_at),
			},
		});
		agencyIds.add(agency.id);
		agencyCount++;
	}

	// Seed contacts
	console.log('👥 Seeding contacts...');
	let contactCount = 0;
	let skippedCount = 0;
	let invalidCount = 0;

	for (const contact of contactsData) {
		// Skip contacts with missing required fields
		if (!contact.email) {
			invalidCount++;
			console.log(`⚠️  Skipping contact with missing data: ${contact.id}`);
			continue;
		}

		// Check if agency_id exists in our agencies, otherwise set to null
		const validAgencyId =
			contact.agency_id && agencyIds.has(contact.agency_id)
				? contact.agency_id
				: null;

		if (contact.agency_id && !validAgencyId) {
			skippedCount++;
		}

		await prisma.contact.create({
			data: {
				id: contact.id,
				first_name: contact.first_name,
				last_name: contact.last_name,
				email: contact.email,
				phone: contact.phone || null,
				title: contact.title || null,
				email_type: contact.email_type || null,
				contact_form_url: contact.contact_form_url || null,
				department: contact.department || null,
				agency_id: validAgencyId,
				firm_id: contact.firm_id || null,
				created_at: parseDateOrNow(contact.created_at),
				updated_at: parseDateOrNow(contact.updated_at),
			},
		});
		contactCount++;
	}

	console.log('✅ Seed completed successfully!');
	console.log(`   - ${agencyCount} agencies created`);
	console.log(`   - ${contactCount} contacts created`);
	if (invalidCount > 0) {
		console.log(
			`   - ${invalidCount} contacts skipped (missing required fields)`
		);
	}
	if (skippedCount > 0) {
		console.log(
			`   - ${skippedCount} contacts with invalid agency_id (set to null)`
		);
	}
}

main()
	.catch((e) => {
		console.error('❌ Seed failed:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
