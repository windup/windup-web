package org.jboss.windup.web.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.io.FileUtils;
import org.jboss.windup.web.addons.websupport.WebPathUtil;
import org.jboss.windup.web.furnaceserviceprovider.FromFurnace;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Singleton
@Startup
public class DataBackup
{
    public static final String BACKUP = "backup";
    public static final Long MAX_AGE_DAYS = 3L;

    private static Logger LOG = Logger.getLogger(DataBackup.class.getName());

    @Inject
    @FromFurnace
    private WebPathUtil webPathUtil;

    @PersistenceContext
    private EntityManager entityManager;

    @Schedule(hour = "5,11,17,23", minute = "10")
    public void maintainBackups()
    {
        this.backupDatabase();
        this.purgeOldBackups();
    }

    private void backupDatabase()
    {
        // NOTE, this probably only works on H2
        Path backupFile = getBackupFile();
        if (backupFile == null)
            return;

        String backupPath = backupFile.toAbsolutePath().toString();
        try
        {
            String backupCommand = "BACKUP TO '" + backupPath + "';";
            this.entityManager.createNativeQuery(backupCommand)
                        .executeUpdate();
            LOG.info("H2 database backed up to: " + backupPath);
        }
        catch (Exception e)
        {
            LOG.log(Level.WARNING, "Error creating hourly auto-backup to: " + backupPath + " due to: " + e.getMessage(), e);
        }
    }

    private void purgeOldBackups()
    {
        Path backupDirectory = this.getBackupDirectory();
        if (backupDirectory == null)
            return;

        try
        {
            Files.list(backupDirectory)
                        .forEach(path -> {
                            try
                            {
                                if (!Files.isRegularFile(path))
                                    return;

                                String filename = path.getFileName().toString();
                                Matcher filenameMatcher = Pattern
                                            .compile("BACKUP_(\\d\\d\\d\\d_\\d\\d_\\d\\d-\\d\\d\\d\\d).zip")
                                            .matcher(filename);
                                if (!filenameMatcher.matches())
                                    return;

                                String dateString = filenameMatcher.group(1);
                                Date date = getDateFormat().parse(dateString);
                                long age = System.currentTimeMillis() - date.getTime();
                                long maxAge = MAX_AGE_DAYS * 24L * 60L * 60L * 1000L;
                                if (age > maxAge)
                                {
                                    LOG.info("Purging old backup file: " + path);
                                    FileUtils.deleteQuietly(path.toFile());
                                }
                            }
                            catch (ParseException e)
                            {
                                LOG.warning("Unexpected file format in backup folder: " + path);
                            }
                        });
        }
        catch (IOException e)
        {
            LOG.warning("Error cleaning up backup folder (path: " + backupDirectory + "): " + e.getMessage());
        }
    }

    private SimpleDateFormat getDateFormat()
    {
        return new SimpleDateFormat("yyyy_MM_dd-HHmm");
    }

    private Path getBackupFile()
    {
        Path directory = getBackupDirectory();
        if (directory == null)
            return null;

        String dateFormatted = getDateFormat().format(new Date());
        String filename = "BACKUP_" + dateFormatted + ".zip";
        return directory.resolve(filename);
    }

    private Path getBackupDirectory()
    {
        Path windupDataPath = webPathUtil.getGlobalWindupDataPath();
        Path backupDirectory = windupDataPath.resolve(BACKUP);

        try
        {
            if (!Files.isDirectory(backupDirectory))
                Files.createDirectories(backupDirectory);
        }
        catch (IOException e)
        {
            LOG.warning("Unable to create folder for backup data: " + e.getMessage());
            return null;
        }
        return backupDirectory;
    }
}
