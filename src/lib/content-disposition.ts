// Header helpers for the markdown download endpoint.

/**
 * Escapes a file name for use inside the quoted `filename` parameter of a
 * Content-Disposition header (RFC 6266): a backslash or double quote would
 * terminate the quoted string early, and CR/LF could smuggle extra headers.
 *
 * @param fileName - File name to embed in the header.
 * @returns The file name with quotes/backslashes escaped and CR/LF removed.
 */
export function escapeFileNameParameter(fileName: string): string {
  return fileName
    .replace(/[\\"]/g, "\\$&")
    .replace(/[\r\n]+/g, " ")
    .trim();
}

/** Builds a `Content-Disposition: attachment` header value for a file name. */
export function attachmentDisposition(fileName: string): string {
  return `attachment; filename="${escapeFileNameParameter(fileName)}"`;
}
