import type { ConfigData } from '#/store/useResumeConfigStore';
import type { SectionData } from '#/store/useResumeSectionsStore';
import type { Format } from '#/types/resume-download';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface ResumePDFTemplateProps {
  config: ConfigData;
  sections: Record<string, SectionData>;
  format: Format;
  pagesMatrix: string[][];
}
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export const ResumePDFTemplate = ({ config, format, sections, pagesMatrix }: ResumePDFTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{format} #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);