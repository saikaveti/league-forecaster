CREATE TABLE main.FangraphsHitterSplits (
    PlayerId INT NOT NULL,
    PlayerName VARCHAR(255) NOT NULL,
    Split VARCHAR(10) NOT NULL,
    Team VARCHAR(100),
    WRCplus DECIMAL(5, 2),
    DateUpdated DATETIME,
    PRIMARY KEY (PlayerId)
);