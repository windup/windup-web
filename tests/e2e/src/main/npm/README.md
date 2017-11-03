# RHAMT-WEB E2E TESTS
## Parameters
- login.username
- login.password
- baseUrl
- upload.filePath

## Maven
Maven processes *.ts files and replaces valid ${} occurrences with its own parameters. 
This can lead to very nasty and difficult to detect bugs.

(I had problem with ${projectId} being replaced in string interpolation expression, 
 `some/path/with/${projectId}` being replaced to `some/path/with/org.jboss.windup.web:windup-tests-e2e:pom:4.1.0-SNAPSHOT` instead of `some/path/with/`)

Known problematic variables:
- ${url}
- ${projectId}
- I would assume 
