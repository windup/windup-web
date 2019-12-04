UI Tests
=====================

If you want to create a test in the UI you need to follow the next steps:

- Create a file `ui/src/main/webapp/tests/app/myTest.spec.ts` and write your test
- If you want to execute your tests, you should execute `mvn test -f ui/` from the root folder of the project.

Notes:
- `mvn test -f ui/` will execute `maven-karma-plugin` which at the same time will execute the tests
- If you create a test outside `ui/src/main/webapp/tests/`, then your test will not be fired (your test file need to be inside `ui/src/main/webapp/tests/` folder).
- If you are a developer, executing `mvn test -f ui/` might take too much time. In order save time you can execute `mvn test -f ui/` just once and then disable (comment) the plugins `maven-clean-plugin` and `exec-maven-plugin` from `ui/pom.xml` file.   
