<?php

const filename = "favorites.json";

if (!file_exists(filename)) {
    file_put_contents(filename, "{}");
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $data = file_get_contents(filename);
    echo $data;
} elseif ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST["id"];
    $title = $_POST["title"];

    $favs = json_decode(file_get_contents(filename));
    $favs->$id = $title;
    file_put_contents(filename, json_encode($favs));
}
