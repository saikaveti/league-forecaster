CREATE TABLE main.FangraphsHitterRange (
    PlayerId INT NOT NULL,
    PlayerName VARCHAR(255) NOT NULL,
    LastRange INT NOT NULL,
    Team VARCHAR(100),
    RangeWRCplus DECIMAL(5, 2),
    DateUpdated DATETIME,
    PRIMARY KEY (PlayerId)
);