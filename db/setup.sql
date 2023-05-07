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
    "sentAt" bigint,
    "user_id" int not null references "User" ("idUser"),
    "chat_id" int not null references "Chat" ("idChat")
);

INSERT INTO
    public."User" (
        "idUser",
        name,
        password,
        "firstName",
        "lastName"
    )
VALUES
    (
        DEFAULT,
        'rainer',
        'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
        'Rainer',
        'Zufall'
    );

INSERT INTO
    public."User" (
        "idUser",
        name,
        password,
        "firstName",
        "lastName"
    )
VALUES
    (
        DEFAULT,
        'karl',
        'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
        'Karl',
        'Kloss'
    );

INSERT INTO
    public."User" (
        "idUser",
        name,
        password,
        "firstName",
        "lastName"
    )
VALUES
    (
        DEFAULT,
        'axel',
        'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
        'Axel',
        'Schweiß'
    );

INSERT INTO
    public."User" (
        "idUser",
        name,
        password,
        "firstName",
        "lastName"
    )
VALUES
    (
        DEFAULT,
        'claire',
        'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86',
        'Claire',
        'Grube'
    );