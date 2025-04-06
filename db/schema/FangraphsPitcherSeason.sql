CREATE TABLE main.FangraphsPitcherSeason (
    PlayerId INT NOT NULL,
    PlayerName VARCHAR(255) NOT NULL,
    Team VARCHAR(100),
    Season INT,
    SeasonXFIP DECIMAL(5, 2),
    DateUpdated DATETIME,
    PRIMARY KEY (PlayerId)
);