// Room-by-room walking order for each dorm, transcribed from the photographed
// dorm charts (B/A/D/C, covering Year 10-13) and cross-checked against the
// student names in results.csv. `key` must match zc_Stu_Name_Last_First_Preferred
// exactly ("Last, First") so results can be looked up; `display` is the name
// as it appears on the chart. Entries with a `note` were ambiguous on the
// chart (crossed-out corrections, unclear handwriting, no CSV match) and are
// worth a quick double-check against the physical charts before relying on
// room numbers in front of a student.
//
// Two Year 13 boys prefect each of the B, A and D dorms (Ralulu in B, Schleifer
// in A, Martin J. and Reed L. together in D) rather than living in their own
// year's dorm (C) — that's why C Dorm only lists 9 of the 13 Year 13 students.
// Unoccupied/blank rooms on the charts are omitted here.

export const DORM_ROSTER = [
  {
    dorm: 'B Dorm',
    year: 'Year 10',
    residents: [
      { room: '1', key: 'Ralulu, Jone', display: 'Jone Ralulu', note: 'Head Boy — prefects this dorm; own results are Year 13' },
      { room: '2', key: 'Tuia, Moses', display: 'Moses Tuia' },
      { room: '3', key: 'Burns, Zaan', display: 'Zaan Burns' },
      { room: '5', key: 'Jerram, Connor', display: 'Connor Jerram' },
      { room: '6', key: 'Perry, Max', display: 'Max Perry' },
      { room: '7', key: 'Hewitt, Jonty', display: 'Jonty Hewitt' },
      { room: '8', key: 'Hayward, Lachie', display: 'Lachie Hayward' },
      { room: '9', key: 'Son, Jonathan', display: 'Jonathan Son' },
      { room: '10', key: 'Winlove, Dean', display: 'Dean Winlove' },
      { room: '11', key: 'Cates, Jack', display: 'Jack Cates' },
      { room: '12', key: 'Marshall, Ollie', display: 'Ollie Marshall' },
      { room: '13', key: null, display: 'Ryosuke', note: 'Surname not legible on chart and no matching NCEA record — confirm identity' },
      { room: '14', key: 'Laing, Jack', display: 'Jack Laing' },
      { room: '15', key: 'Gleeson, Oscar', display: 'Oscar Gleeson' },
      { room: '16', key: 'Herrick, Ben', display: 'Ben Herrick' },
      { room: '17', key: 'Jackson, Angus', display: 'Angus Jackson' },
      { room: '18', key: 'Guscott, Benjamin', display: 'Ben Guscott' },
      { room: '19', key: 'Marshall, Franklin', display: 'Franklin Marshall' },
      { room: '21', key: 'Bazley, Harrison', display: 'Harrison Bazley' },
    ],
  },
  {
    dorm: 'A Dorm',
    year: 'Year 11',
    residents: [
      { room: '19', key: 'Schleifer, Tobin', display: 'Tobin Schleifer', note: 'Deputy Head Boy — prefects this dorm; own results are Year 13' },
      { room: '18', key: 'Graf von Ballestrem, Tassilo', display: 'Tassilo Graf von Ballestrem', note: 'Name corrected on chart (was "Tassilo von Graf") — confirm spelling' },
      { room: '17', key: 'Hyslop, Angus', display: 'Angus Hyslop' },
      { room: '16', key: 'Tosswill, Samuel', display: 'Samuel Tosswill' },
      { room: '15', key: 'Moody, Zephyr', display: 'Zephyr Moody' },
      { room: '14', key: 'Thomas, Henry', display: 'Henry Thomas' },
      { room: '13', key: 'McGrath, Victor', display: 'Victor McGrath' },
      { room: '12', key: 'Reid, Hamish', display: 'Hamish Reid' },
      { room: '11', key: 'Nation, Logan', display: 'Logan Nation' },
      { room: '10', key: 'Nakane, Shimpei', display: 'Shimpei Nakane' },
      { room: '9', key: 'Paulino, Natachai', display: 'Natachai Paulino' },
      { room: '8', key: 'Mackie, Alex', display: 'Alexander Mackie' },
      { room: '7', key: 'Du, Luca', display: 'Luca Du' },
      { room: '6', key: 'Reynolds, Jacko', display: 'Jacko Reynolds' },
      { room: '5', key: 'Handyside, Louis', display: 'Louis Handyside' },
      { room: '4', key: 'Hoani-Donnelly, Hamish', display: 'Hamish Hoani-Donnelly' },
      { room: '3', key: "O'Connor, Henry", display: "Henry O'Connor" },
    ],
  },
  {
    dorm: 'D Dorm',
    year: 'Year 12',
    residents: [
      { room: '17', key: 'Reed, Lachlan', display: 'Lachlan Reed', note: 'Prefects this dorm with Martin, J.; own results are Year 13' },
      { room: '16', key: 'Robinson, Kade', display: 'Kade Robinson' },
      { room: '15', key: 'Miyake, Leo', display: 'Leo Miyake' },
      { room: '14', key: 'Gazley, Rudy', display: 'Rudy Gazley' },
      { room: '13', key: 'Govindasamy, Kaden', display: 'Kaden Govindasamy' },
      { room: '12', key: 'Brader, Harry', display: 'Harry Brader' },
      { room: '11', key: 'Brenstrum, Donovan', display: 'Donovan Brenstrum' },
      { room: '10', key: 'Martin, Louie', display: 'Louie Martin', note: 'Shared room with T. Hurley — confirm current room split' },
      { room: '10', key: 'Hurley, Tom', display: 'Tom Hurley', note: 'Shared room with L. Martin — confirm current room split' },
      { room: '9', key: 'Read, Tommy', display: 'Tommy Read' },
      { room: '8', key: 'Thorpe, Ben', display: 'Ben Thorpe' },
      { room: '7', key: 'Ashford, Lachie', display: 'Lachie Ashford' },
      { room: '6', key: 'McGlashan, Zack', display: 'Zack McGlashan', note: 'Name corrected on chart — confirm spelling' },
      { room: '5', key: 'Falloon, Tom', display: 'Tom Falloon' },
      { room: '4', key: 'Keighley, Cooper', display: 'Cooper Keighley' },
      { room: '2', key: 'Williams, Oliver', display: 'Oliver Williams' },
      { room: '1', key: 'Martin, John', display: 'John Martin', note: 'Prefects this dorm with Reed, L.; own results are Year 13' },
    ],
  },
  {
    dorm: 'C Dorm',
    year: 'Year 13',
    residents: [
      { room: '14', key: 'Allan, Franklin', display: 'Franklin Allan', note: 'Chart spells surname "Allen" — confirm spelling' },
      { room: '13', key: 'Shaw, Patrick', display: 'Patrick Shaw' },
      { room: '11', key: 'Hodgson, Daniel', display: 'Daniel Hodgson' },
      { room: '9', key: 'Reynolds, Ricki', display: 'Ricki Reynolds', note: 'Chart has a hand-drawn line/arrow between this room and room 5 — meaning unclear, confirm' },
      { room: '1', key: 'Edge, Charles', display: 'Charles Edge' },
      { room: '3', key: 'Brown, Sheldon', display: 'Sheldon Brown' },
      { room: '4', key: 'Orsborn, William', display: 'William Orsborn', note: 'Chart spells surname "Osborn" — confirm spelling' },
      { room: '5', key: 'Ratima, Tama', display: 'Tama Ratima', note: 'Chart has a hand-drawn line/arrow between this room and room 9 — meaning unclear, confirm' },
      { room: '8', key: 'Heaton, Matthew', display: 'Matthew Heaton' },
    ],
  },
];
