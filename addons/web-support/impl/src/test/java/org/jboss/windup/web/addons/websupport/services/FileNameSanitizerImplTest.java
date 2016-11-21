package org.jboss.windup.web.addons.websupport.services;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class FileNameSanitizerImplTest
{
    private FileNameSanitizer sanitizer;

    @Before
    public void initialize()
    {
        this.sanitizer = new FileNameSanitizerImpl();
    }

    @Test
    public void testValidFileName()
    {
        String fileName = "this-is-valid.jar";

        Assert.assertEquals(fileName, this.sanitizer.cleanFileName(fileName));
    }

    @Test
    public void testWindowsFilePath()
    {
        String fileName = "C:\\Windows\\Path\\this-is-invalid.jar";
        String cleanFileName = "C__Windows_Path_this-is-invalid.jar";

        Assert.assertEquals(cleanFileName, this.sanitizer.cleanFileName(fileName));
    }

    @Test
    public void testLinuxFilePath()
    {
        String fileName = "/usr/bin/linux/path/this-is-invalid.jar";
        String cleanFileName = "_usr_bin_linux_path_this-is-invalid.jar";

        Assert.assertEquals(cleanFileName, this.sanitizer.cleanFileName(fileName));
    }

    @Test
    public void testInvalidFileName()
    {
        String fileName = ":some-invalid_characters\r\n\0\t*\"?<>|%";
        String cleanFileName = "_some-invalid_characters___________";

        Assert.assertEquals(cleanFileName, this.sanitizer.cleanFileName(fileName));
    }

    @Test
    public void testShortenFileName()
    {
        String fileName = "some-very-long-file-name-with-extension.ext";
        String cleanFileName = "some.ext";

        Assert.assertEquals(cleanFileName, this.sanitizer.shortenFileName(fileName, 8));
    }

    @Test
    public void testShortenFileNameLongExt()
    {
        String fileName = ".htaccess";
        String cleanFileName = ".ht";

        Assert.assertEquals(cleanFileName, this.sanitizer.shortenFileName(fileName, 3));
    }


    @Test
    public void testShortenLongFileNameLongExt()
    {
        String fileName = "htaccess.htaccess";
        String cleanFileName = "htac";

        Assert.assertEquals(cleanFileName, this.sanitizer.shortenFileName(fileName, 4));
    }

    @Test
    public void testShortenShortEnoughFileName()
    {
        String fileName = "some.ext";
        String cleanFileName = "some.ext";

        Assert.assertEquals(cleanFileName, this.sanitizer.shortenFileName(fileName, 8));
    }
}
