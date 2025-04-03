CREATE TABLE game.PitchingProbables (
    HomeTeam NVARCHAR(100) NOT NULL,
    AwayTeam NVARCHAR(100) NOT NULL,
    Pitcher NVARCHAR(100) NOT NULL,
    GameDate DATE NOT NULL,
    PRIMARY KEY (GameDate, HomeTeam, AwayTeam)
);