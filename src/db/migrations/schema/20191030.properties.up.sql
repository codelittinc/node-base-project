CREATE TABLE properties
(
    "id" SERIAL PRIMARY KEY,
    "name" character varying(128) NOT NULL,
    "minRent" numeric NOT NULL,
    "maxRent" numeric NOT NULL,
    "createdAt" TIMESTAMP
    WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP
    WITH TIME ZONE NOT NULL,
     "userId" INTEGER REFERENCES "users"
    ("id") ON
    UPDATE CASCADE ON
    DELETE CASCADE
);