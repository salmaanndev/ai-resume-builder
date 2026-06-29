import { Font } from '@react-pdf/renderer';
import { ResumeFont } from './resumeFonts';

let fontsRegistered = false;

export function registerPdfFonts(): void {
  if (fontsRegistered) return;
  fontsRegistered = true;

  Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: 'https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Me5Q.ttf',
        fontWeight: 400,
      },
      {
        src: 'https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmWUlfBBc9.ttf',
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: 'Open Sans',
    fonts: [
      {
        src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJYAdQmZ4ddQ.ttf',
        fontWeight: 400,
      },
      {
        src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJYAdQmZ4ddU.ttf',
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: 'Lato',
    fonts: [
      {
        src: 'https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.ttf',
        fontWeight: 400,
      },
      {
        src: 'https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwiPHA.ttf',
        fontWeight: 700,
      },
    ],
  });
}

/** Maps resume font choices to @react-pdf/renderer font families. */
export const getPdfFontFamily = (font: ResumeFont | undefined): string => {
  switch (font) {
    case 'georgia':
    case 'cambria':
    case 'garamond':
    case 'times-new-roman':
      return 'Times-Roman';
    case 'roboto':
      return 'Roboto';
    case 'open-sans':
      return 'Open Sans';
    case 'lato':
      return 'Lato';
    default:
      return 'Helvetica';
  }
};
