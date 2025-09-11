import React from 'react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { CheckCircle, Award, Target, Users } from 'lucide-react';
import mockData from '../data/mock';

const About = () => {
  const { about, stats } = mockData;

  const achievements = [
    { icon: Award, title: "Best Design Award", description: "Received recognition for outstanding web design" },
    { icon: Target, title: "100% Project Success", description: "All projects delivered on time and within budget" },
    { icon: Users, title: "Happy Clients", description: "Consistently 5-star reviews from satisfied clients" }
  ];

  const skills = [
    { name: "React & Next.js", level: 95 },
    { name: "Node.js & Express", level: 90 },
    { name: "UI/UX Design", level: 85 },
    { name: "MongoDB & Firebase", level: 88 },
    { name: "WordPress Development", level: 92 },
    { name: "Digital Marketing", level: 80 }
  ];

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="outline">About MMB</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Passionate About Creating Digital Excellence
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {about.description}
          </p>
          
          {/* Profile Image */}
          <div className="w-40 h-40 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-6xl font-bold">
            MMB
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Technical Expertise
            </h2>
            <p className="text-gray-600 text-lg">
              Proficient in modern web technologies and frameworks
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className="text-blue-600">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">Key Skills</h3>
              <div className="grid grid-cols-1 gap-4">
                {about.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              My Journey
            </h2>
            <p className="text-gray-600 text-lg">
              From passion to profession - building digital solutions that matter
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">2021</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">Started Web Development Journey</h3>
                    <p className="text-gray-600">
                      Began learning modern web technologies including React, Node.js, and responsive design principles.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">2022</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">First Professional Projects</h3>
                    <p className="text-gray-600">
                      Completed first commercial projects including e-commerce websites and corporate portals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold">2024</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">Full-Stack Expertise</h3>
                    <p className="text-gray-600">
                      Expanded expertise to full-stack development, specializing in modern web applications and digital solutions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Achievements & Recognition
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-gray-600">{achievement.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              My Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Quality First</h3>
              <p className="text-gray-600">
                Every project is crafted with attention to detail, ensuring high-quality code, 
                beautiful design, and optimal performance.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Client-Focused</h3>
              <p className="text-gray-600">
                Understanding client needs and delivering solutions that exceed expectations 
                is at the heart of every project.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Continuous Learning</h3>
              <p className="text-gray-600">
                Staying updated with the latest technologies and trends to provide 
                cutting-edge solutions.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Timely Delivery</h3>
              <p className="text-gray-600">
                Committed to delivering projects on time without compromising on quality 
                or functionality.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;