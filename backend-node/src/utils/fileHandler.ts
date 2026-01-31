import PdfParse from 'pdf-parse';

export async function extractTextFromFile(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.toLowerCase().split('.').pop();

  if (ext === 'txt') {
    return buffer.toString('utf-8');
  } else if (ext === 'pdf') {
    try {
      const data = await PdfParse(buffer);
      return data.text;
    } catch (error) {
      throw new Error(`Failed to extract text from PDF: ${error}`);
    }
  }

  throw new Error('Unsupported file type');
}
