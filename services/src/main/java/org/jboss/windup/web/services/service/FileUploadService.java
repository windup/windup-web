package org.jboss.windup.web.services.service;

import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.windup.web.services.rest.FileAlreadyExistsException;

import javax.ws.rs.BadRequestException;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.core.MultivaluedMap;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
public class FileUploadService
{
    private static Logger LOG = Logger.getLogger(FileUploadService.class.getSimpleName());

    public String getFileName(MultipartFormDataInput data)
    {
        return this.getFileName(data, "file");
    }

    public String getFileName(MultipartFormDataInput data, String key)
    {
        InputPart inputPart = this.getInputPart(data, key);
        return this.getFileNameFromHeaders(inputPart.getHeaders());
    }

    protected InputPart getInputPart(MultipartFormDataInput data, String key)
    {
        Map<String, List<InputPart>> uploadForm = data.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get(key);

        int uploadedFiles = inputParts.size();

        if (uploadedFiles > 1)
        {
            throw new BadRequestException("Use endpoint /multiple to register multiple applications");
        }
        else if (uploadedFiles == 0)
        {
            throw new BadRequestException("Please provide a file");
        }

        return inputParts.get(0);
    }

    protected String getFileNameFromHeaders(MultivaluedMap<String, String> header)
    {
        String[] contentDisposition = header.getFirst("Content-Disposition").split(";");

        for (String filename : contentDisposition)
        {
            if ((filename.trim().startsWith("filename")))
            {

                String[] name = filename.split("=");

                return name[1].trim().replaceAll("\"", "");
            }
        }

        throw new BadRequestException("Missing file name");
    }

    public File uploadFile(MultipartFormDataInput data, Path filePath, String fileName, boolean rewrite)
    {
        return this.uploadFile(data, "file", filePath, fileName, rewrite);
    }

    public File uploadFile(MultipartFormDataInput data, String key, Path filePath, String fileName, boolean rewrite)
    {
        Map<String, List<InputPart>> uploadForm = data.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get(key);

        int uploadedFiles = inputParts.size();

        if (uploadedFiles > 1)
        {
            throw new BadRequestException("Use endpoint /multiple to register multiple applications");
        }
        else if (uploadedFiles == 0)
        {
            throw new BadRequestException("Please provide a file");
        }


        return this.saveFileTo(inputParts.get(0), filePath, fileName, rewrite);
    }

    protected File saveFileTo(InputPart inputPart, Path directory, String fileName, boolean rewrite)
    {
        try
        {
            // convert the uploaded file to inputstream
            InputStream inputStream = inputPart.getBody(InputStream.class, null);

            Path filePath = directory.resolve(fileName);
            File file = new File(filePath.toString());

            if (file.exists() && !rewrite)
            {
                LOG.warning("File in path: " + filePath + " already exists, but it should not");
                throw new FileAlreadyExistsException(new BadRequestException("File with name: '" + fileName + "' already exists"));
            }

            this.saveFileTo(inputStream, filePath.toString());

            return file;
        }
        catch (IOException ex)
        {
            LOG.log(Level.SEVERE, null, ex);
            throw new InternalServerErrorException("Error during file upload");
        }
    }

    protected void saveFileTo(InputStream inputStream, String filePath) throws IOException
    {
        File file = new File(filePath);

        file.getParentFile().mkdirs();

        OutputStream os = new FileOutputStream(file);
        byte[] buffer = new byte[256];
        int bytes = 0;
        while ((bytes = inputStream.read(buffer)) != -1)
        {
            os.write(buffer, 0, bytes);
        }
    }
}
