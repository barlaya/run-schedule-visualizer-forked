const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { Mutex } = require('async-mutex');

const app = express();
const port = 5000;
const dataFile = path.join(__dirname, 'projects.json');
const mutex = new Mutex();


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));

//returns from projects json
async function readProjects() {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
}


async function writeProjects(projects) {
    await fs.writeFile(dataFile, JSON.stringify(projects, null, 2), 'utf8');
}
//endpoints request: lock, response: returned updated topsis json
app.get('/api/projects', async (req, res) => {
    const release = await mutex.acquire();
    try {
        const projects = await readProjects();

        const updatedProjects = projects.map(project => ({
            ...project,
            topsisScore: Math.min(0.99, Math.max(0.5, project.topsisScore + (Math.random() * 0.2 - 0.1))),
        }));
        res.json(updatedProjects);
    } catch (err) {
        res.status(500).json({ error: 'Error reading projects.json' });
    } finally {
        release();
    }
});

app.post('/api/addProject', async (req, res) => {
    const release = await mutex.acquire();
    try {
        const project = req.body;
        const projects = await readProjects();

        const topsisScore = Math.random() * 0.3 + 0.6;

        const newProject = {
            id: `${projects.length + 1}`,
            topsisScore,
            ...project,
        };

        projects.push(newProject);
        await writeProjects(projects);

        res.status(201).json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Error writing to projects.json' });
    } finally {
        release();
    }
});

//start server from port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});