import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	templatesTable: {
		sections: r.many.sectionsTable(),
	},
	sectionsTable: {
		template: r.one.templatesTable({
			from: r.sectionsTable.templateId,
			to: r.templatesTable.id,
		}),
		fields: r.many.fieldsTable(),
	},
	fieldsTable: {
		section: r.one.sectionsTable({
			from: r.fieldsTable.sectionsId,
			to: r.sectionsTable.id,
		}),
		alignment: r.one.fieldAlignmentsTable({
			from: r.fieldsTable.id,
			to: r.fieldAlignmentsTable.fieldId,
		}),
	},
	fieldAlignmentsTable: {
		field: r.one.fieldsTable({
			from: r.fieldAlignmentsTable.fieldId,
			to: r.fieldsTable.id,
		}),
	},
}));
