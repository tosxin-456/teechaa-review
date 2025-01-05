export const results = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Rome"],
        correctOption: 0,
        isCorrect: true,
        explanation: "The capital of France is Paris.",
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctOption: 1,
        isCorrect: false,
        explanation: "2 + 2 equals 4.",
    },
];

export const studentAnswers = [
    {
        examType: "JAMB",
        year: 2010,
        answers: {
            Mathematics: [1, 1,2,2,0,1,2,3,1, 2],
            Physics: [1, 1, 2, 2, 0, 1, 2, 3, 1, 2],
            English: [1, 1, 2, 2, 0, null, 2, 3, 1, null],
        }
    },
    {
        examType: "JAMB",
        year: 2023,
        answers: {
            English: [2, 1], 
            Chemistry: [1, 2],
        }
    },
    {
        examType: "JAMB",
        year: 2022,
        answers: {
            English: [2, 0], 
        }
    },
    {
        examType: "JAMB",
        year: 2021,
        answers: {
            English: [2, 1],
            Chemistry: [1, 2],
        }
    },
    {
        examType: "WAEC",
        year: 2024,
        answers: {
            English: [2, 0],
        }
    },
    {
        examType: "WAEC",
        year: 2023,
        answers: {
            Mathematics: [2, 2], 
        }
    },
    {
        examType: "WAEC",
        year: 2022,
        answers: {
            English: [2, 0],
        }
    },
    {
        examType: "WAEC",
        year: 2021,
        answers: {
            Mathematics: [2, 2],
        }
    }
];