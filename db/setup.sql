CREATE TABLE IF NOT EXISTS "User" (
    "idUser" serial primary key,
    "name" varchar(50) not null unique CHECK (length(name) > 0),
    "password" varchar(128) not null,
    "firstName" varchar(255) not null,
    "lastName" varchar(255) not null
);

CREATE TABLE IF NOT EXISTS "Chat" (
    "idChat" serial primary key,
    "fromUser_id" int not null references "User" ("idUser"),
    "toUser_id" int not null references "User" ("idUser"),
    UNIQUE("fromUser_id", "toUser_id")
);

CREATE TABLE IF NOT EXISTS "Session" (
    "idSession" serial primary key,
    token varchar(32) not null unique,
    "expiresAt" bigint,
    user_id int not null references "User" ("idUser")
);

CREATE TABLE IF NOT EXISTS "Message" (
    "idMessage" serial primary key,
    content TEXT not null,
    sentAt bigint,
    "user_id" int not null references "User" ("idUser")
);