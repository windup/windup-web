
def checkFileExists(fileName){
    File mappingFile = new File( basedir, "target/tsModels/" + fileName );
    assert mappingFile.exists();
    assert mappingFile.isFile();
}

checkFileExists("FileModel.ts");

File mappingFile = new File( basedir, "target/DiscriminatorMappingData.ts" );
assert mappingFile.exists();
assert mappingFile.isFile();
