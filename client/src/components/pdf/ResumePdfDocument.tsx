import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { getPdfFontFamily, registerPdfFonts } from '../../constants/pdfFonts';
import { getPdfFontSizes } from '../../constants/resumeFontSizes';
import { Resume } from '../../types';
import { contactParts, formatBullets } from '../resume/resumeBlocks';

registerPdfFonts();

function createStyles(fontSizes: ReturnType<typeof getPdfFontSizes>) {
  return StyleSheet.create({
    page: {
      paddingTop: 34,
      paddingBottom: 40,
      paddingHorizontal: 40,
      fontSize: fontSizes.body,
      lineHeight: 1.35,
      color: '#000000',
    },
    header: {
      textAlign: 'center',
      marginBottom: 10,
      paddingBottom: 8,
      borderBottomWidth: 1.5,
      borderBottomColor: '#000000',
    },
    nameWrapper: {
      marginBottom: 3,
    },
    name: {
      fontSize: fontSizes.name,
      fontWeight: 'bold',
      marginBottom: 15
    },
    contact: {
      fontSize: fontSizes.contact,
      color: '#1a1a1a',
    },
    section: {
      marginBottom: 9,
    },
    sectionTitle: {
      fontSize: fontSizes.sectionTitle,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: 5,
      paddingBottom: 2,
      borderBottomWidth: 0.75,
      borderBottomColor: '#333333',
    },
    text: {
      textAlign: 'justify',
    },
    entry: {
      marginBottom: 7,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 8,
      marginBottom: 2,
    },
    entryTitle: {
      fontWeight: 'bold',
      fontSize: fontSizes.entryTitle,
      flex: 1,
    },
    entryDate: {
      fontSize: fontSizes.entryDate,
      color: '#1a1a1a',
    },
    bullet: {
      marginLeft: 12,
      marginBottom: 1,
    },
    skills: {
      lineHeight: 1.45,
    },
    pageNumber: {
      position: 'absolute',
      bottom: 18,
      right: 40,
      fontSize: fontSizes.pageNumber,
      color: '#666666',
    },
  });
}

interface ResumePdfDocumentProps {
  resume: Resume;
}

export default function ResumePdfDocument({ resume }: ResumePdfDocumentProps) {
  const fontFamily = getPdfFontFamily(resume.fontFamily);
  const styles = createStyles(getPdfFontSizes(resume.fontSize));
  const { personalInfo, experience, education, skills } = resume;
  const contact = contactParts(personalInfo);
  const fileName = (personalInfo.fullName || resume.title || 'resume').replace(/\s+/g, '_');

  return (
    <Document title={resume.title} author={personalInfo.fullName || 'Resume'} subject={fileName}>
      <Page size="A4" style={[styles.page, { fontFamily }]} wrap>
        <View style={styles.header}>
          <View style={styles.nameWrapper}>
            <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          </View>
          {contact.length > 0 && <Text style={styles.contact}>{contact.join(' | ')}</Text>}
        </View>

        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{personalInfo.summary}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experience.map((exp, i) => (
              <View key={exp._id || i} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {exp.position}
                    {exp.company ? `, ${exp.company}` : ''}
                  </Text>
                  {(exp.startDate || exp.endDate || exp.current) && (
                    <Text style={styles.entryDate}>
                      {exp.startDate}
                      {exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}
                      {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  )}
                </View>
                {exp.description &&
                  formatBullets(exp.description).map((bullet, j) => (
                    <Text key={j} style={styles.bullet}>
                      • {bullet}
                    </Text>
                  ))}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={edu._id || i} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ''}
                    {edu.institution ? `, ${edu.institution}` : ''}
                  </Text>
                  {(edu.startDate || edu.endDate) && (
                    <Text style={styles.entryDate}>
                      {edu.startDate}
                      {edu.startDate && edu.endDate ? ' – ' : ''}
                      {edu.endDate}
                    </Text>
                  )}
                </View>
                {edu.description && <Text style={styles.text}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skills}>{skills.join(' • ')}</Text>
          </View>
        )}

        <Text
          style={styles.pageNumber}
          fixed
          render={({ pageNumber, totalPages }) =>
            totalPages > 1 ? `Page ${pageNumber} of ${totalPages}` : ''
          }
        />
      </Page>
    </Document>
  );
}
