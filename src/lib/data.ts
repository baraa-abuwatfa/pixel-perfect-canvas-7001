export type Opportunity = {
  id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  responsibilities: string[];
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "ai-automation-intern",
    title: "AI Automation Intern",
    company: "TechFlow",
    description:
      "Support development of AI-powered workflows and automation solutions for business processes.",
    skills: ["Python", "AI", "Automation", "APIs"],
    responsibilities: [
      "Help design and prototype automated workflows for internal teams",
      "Write Python scripts that connect services through APIs",
      "Test AI-assisted tools and document their results",
      "Collaborate with engineers to improve existing automations",
    ],
  },
  {
    id: "junior-frontend-developer",
    title: "Junior Frontend Developer",
    company: "PixelWorks",
    description: "Help build responsive web interfaces and interactive user experiences.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    responsibilities: [
      "Build responsive pages and reusable UI components in React",
      "Translate designs into accessible, well-structured markup",
      "Fix layout and interaction bugs across browsers and devices",
      "Participate in code reviews and team planning",
    ],
  },
  {
    id: "iot-solutions-engineer",
    title: "IoT Solutions Engineer",
    company: "Connected Systems Lab",
    description:
      "Support development of connected systems using sensors, microcontrollers, and software.",
    skills: ["IoT", "Python", "ESP32", "APIs"],
    responsibilities: [
      "Assemble and test sensor setups using ESP32 microcontrollers",
      "Write firmware and Python tooling to collect device data",
      "Integrate devices with cloud services through APIs",
      "Document hardware and software configurations",
    ],
  },
];

export const getOpportunity = (id: string) => OPPORTUNITIES.find((o) => o.id === id);

export type Profile = {
  name: string;
  headline: string;
  about: string;
  skills: string;
  projects: string;
  experience: string;
};

export const EMPTY_PROFILE: Profile = {
  name: "",
  headline: "",
  about: "",
  skills: "",
  projects: "",
  experience: "",
};

/** Clearly-labeled fictional sample. Not the current user's information. */
export const SAMPLE_PROFILE: Profile = {
  name: "Alex Sample (fictional)",
  headline: "Computer Science student interested in software and automation",
  about:
    "This is a fictional sample profile used for demonstration. Replace it with your own details.",
  skills: "Python, HTML, CSS, JavaScript, Git",
  projects: "Personal portfolio website built with HTML and CSS\nPython script that organizes files automatically",
  experience: "Volunteer tutor for introductory programming (1 semester)",
};
