# Repton Results

A small Svelte app for browsing student assessment results week by week.

It reads the exported markbook CSV under [`data/`](data/) and shows, for each
week, a matrix of grade (**Not Achieved / Achieved / Merit / Excellence**)
against student — students run along the bottom on an angle, grades run down
the side, and each cell's shading shows how many results that student got at
that grade in the selected week. A slider flips through the weeks; a subject
filter narrows the matrix to one course; clicking a cell opens a panel with
the underlying assessment details (subject, title, teacher, comment).

Only rows that map to an NCEA-style grade are included — effort/attitude
grades ("Requirements Met", "Working Well", etc.) use a different rubric and
are excluded. Numeric percentage scores are banded into NA/A/M/E using
<50 / <65 / <80 / 80+ cutoffs.

## Setup

```bash
cd app
npm install
```

## Run

```bash
npm run dev
```

Then open the URL Vite prints (defaults to http://localhost:5173).

## Data

The app reads `app/public/data/results.csv`. If you export a new CSV from
the markbook, copy it over that file (keeping the same name) and refresh
the page — no rebuild needed.

```bash
cp data/<new-export>.csv app/public/data/results.csv
```
