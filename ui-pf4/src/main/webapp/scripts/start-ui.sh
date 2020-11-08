until $(curl --output /dev/null --silent --head --fail http://localhost:8080); do
    printf '.'
    sleep 3
done

yarn start
