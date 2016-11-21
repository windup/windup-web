package org.jboss.windup.web.addons.websupport.services;

import java.util.Arrays;

/**
 * Class used for cleaning invalid file names Based on
 * http://stackoverflow.com/questions/1155107/is-there-a-cross-platform-java-method-to-remove-filename-special-chars
 *
 *
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class FileNameSanitizerImpl implements FileNameSanitizer
{
    private final static int[] illegalChars = { 34, 37, 42, 47, 58, 60, 62, 63, 92, 124 };

    static
    {
        Arrays.sort(illegalChars);
    }

    public String cleanFileName(String originalFileName, char replacementCharacter)
    {
        StringBuilder cleanName = new StringBuilder();
        int len = originalFileName.codePointCount(0, originalFileName.length());

        for (int i = 0; i < len; i++)
        {
            int c = originalFileName.codePointAt(i);
            if (!this.isCodeSequence(c) && Arrays.binarySearch(illegalChars, c) < 0)
            {
                cleanName.appendCodePoint(c);
            }
            else
            {
                cleanName.appendCodePoint(replacementCharacter);
            }
        }

        return cleanName.toString();
    }

    @Override
    public String cleanFileName(String originalFileName)
    {
        return this.cleanFileName(originalFileName, '_');
    }

    @Override
    public String shortenFileName(String originalFileName, int maxLength) {
        if (originalFileName.length() > maxLength) {
            String ext = this.getExtension(originalFileName);

            int beforeExtLength = originalFileName.length() - ext.length();

            if (beforeExtLength > 0 && this.isValidExtension(ext) && maxLength > ext.length()) {
                return originalFileName.substring(0, maxLength - ext.length()) + ext;
            } else {
                /*
                 * for hidden files or files with invalid extension
                 *  we don't have to preserve the original extension.
                 */
                return originalFileName.substring(0, maxLength);
            }
        }

        return originalFileName;
    }

    /**
     * Simplified validation of file extension
     *
     * This is over-simplified validation which checks only length of the extension.
     * Common file extensions are usually very small,
     * so any extension longer than 20 chars is considered invalid.
     */
    protected boolean isValidExtension(String ext)
    {
        return ext.length() <= 20;
    }

    protected String getExtension(String fileName)
    {
        int extBeginsAt = fileName.lastIndexOf(".");

        if (extBeginsAt == -1)
        {
            return "";
        }

        return fileName.substring(extBeginsAt);
    }

    protected boolean isCodeSequence(int charNum)
    {
        return charNum >= 0 && charNum <= 31;
    }
}
