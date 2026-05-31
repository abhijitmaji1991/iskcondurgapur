import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'courses.json');

// Ensure the data directory exists
const ensureDbExists = () => {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
    }
};

export const coursesFallbackDb = {
    getAll: () => {
        ensureDbExists();
        try {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading fallback DB:', error);
            return [];
        }
    },

    getById: (id: string) => {
        const courses = coursesFallbackDb.getAll();
        return courses.find((course: any) => course._id === id || course.id === id);
    },

    create: (courseData: any) => {
        const courses = coursesFallbackDb.getAll();
        const newCourse = {
            _id: Date.now().toString(),
            ...courseData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        courses.push(newCourse);
        fs.writeFileSync(DB_FILE, JSON.stringify(courses, null, 2), 'utf8');
        return newCourse;
    },

    update: (id: string, updateData: any) => {
        const courses = coursesFallbackDb.getAll();
        const index = courses.findIndex((course: any) => course._id === id || course.id === id);
        if (index !== -1) {
            courses[index] = {
                ...courses[index],
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            fs.writeFileSync(DB_FILE, JSON.stringify(courses, null, 2), 'utf8');
            return courses[index];
        }
        return null;
    },

    delete: (id: string) => {
        let courses = coursesFallbackDb.getAll();
        const initialLength = courses.length;
        courses = courses.filter((course: any) => course._id !== id && course.id !== id);
        if (courses.length !== initialLength) {
            fs.writeFileSync(DB_FILE, JSON.stringify(courses, null, 2), 'utf8');
            return true;
        }
        return false;
    }
};
