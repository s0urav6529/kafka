To run Kafka on Docker, first confirm your Docker Desktop is running. Then execute the following command from the kafka-on-docker directory:

     docker compose up -d

The -d flag runs the docker container in detached mode which is similar to running Unix commands in the background by appending &. To confirm the container is running, run this command:

    docker logs broker

Now let's produce and consume a message! To produce a message, let's open a command terminal on the Kafka container:

    docker exec -it -w /opt/kafka/bin broker sh

Then create a topic:

    ./kafka-topics.sh --create --topic <topic_name> --bootstrap-server broker:29092

To shut down the container, run

    docker compose down -v

---

For see the topics that are in the kafka broker

    docker exec -it broker bash

then go

    /opt/kafka/bin/kafka-topics.sh --bootstrap-server broker:29092 --list
