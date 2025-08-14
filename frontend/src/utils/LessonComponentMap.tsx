import React from 'react';

import { Lesson1 as Beginner1 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson1';
import { Lesson2 as Beginner2 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson2';
import { Lesson3 as Beginner3 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson3';
import { Lesson4 as Beginner4 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson4';
import { Lesson5 as Beginner5 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson5';
import { Lesson6 as Beginner6 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson6';
import { Lesson7 as Beginner7 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson7';
import { Lesson8 as Beginner8 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson8';
import { Lesson9 as Beginner9 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson9';
import { Lesson10 as Beginner10 } from '../pages/webCourses/BeginnerWebCourse/Lessons/Lesson10';

import { Lesson1 as Intermediate1 } from '../pages/webCourses/IntermediateWebCourse/lessons/Lesson1';
import { Lesson2 as Intermediate2 } from '../pages/webCourses/IntermediateWebCourse/lessons/Lesson2';
import { Lesson3 as Intermediate3 } from '../pages/webCourses/IntermediateWebCourse/lessons/Lesson3';
import { Lesson4 as Intermediate4 } from '../pages/webCourses/IntermediateWebCourse/lessons/Lesson4';
import { Lesson5 as Intermediate5 } from '../pages/webCourses/IntermediateWebCourse/lessons/Lesson5';
import { Lesson6 as Intermediate6 } from '../pages/webCourses/IntermediateWebCourse/lessons/Lesson6';
import { Lesson7 as Intermediate7 } from '../pages/webCourses/IntermediateWebCourse/lessons/Lesson7';
import { Lesson8 as Intermediate8 } from '../pages/webCourses/IntermediateWebCourse/lessons/Lesson8';
import { Lesson9 as Intermediate9 } from '../pages/webCourses/IntermediateWebCourse/lessons/Lesson9';
import { Lesson10 as Intermediate10 } from '../pages/webCourses/IntermediateWebCourse/lessons/Lesson10';

import { Lesson1 as Advanced1 } from '../pages/webCourses/AdvancedWebCourse/lessons/Lesson1';
import { Lesson2 as Advanced2 } from '../pages/webCourses/AdvancedWebCourse/lessons/Lesson2';
import { Lesson3 as Advanced3 } from '../pages/webCourses/AdvancedWebCourse/lessons/Lesson3';
import { Lesson4 as Advanced4 } from '../pages/webCourses/AdvancedWebCourse/lessons/Lesson4';
import { Lesson5 as Advanced5 } from '../pages/webCourses/AdvancedWebCourse/lessons/Lesson5';
import { Lesson6 as Advanced6 } from '../pages/webCourses/AdvancedWebCourse/lessons/Lesson6';
import { Lesson7 as Advanced7 } from '../pages/webCourses/AdvancedWebCourse/lessons/Lesson7';
import { Lesson8 as Advanced8 } from '../pages/webCourses/AdvancedWebCourse/lessons/Lesson8';
import { Lesson9 as Advanced9 } from '../pages/webCourses/AdvancedWebCourse/lessons/Lesson9';
import { Lesson10 as Advanced10 } from '../pages/webCourses/AdvancedWebCourse/lessons/Lesson10';

export const lessonComponentMap: Record<string, JSX.Element[]> = {
  beginner: [
    <Beginner1 />, <Beginner2 />, <Beginner3 />, <Beginner4 />, <Beginner5 />,
    <Beginner6 />, <Beginner7 />, <Beginner8 />, <Beginner9 />, <Beginner10 />,
  ],
  intermediate: [
    <Intermediate1 />, <Intermediate2 />, <Intermediate3 />, <Intermediate4 />, <Intermediate5 />,
    <Intermediate6 />, <Intermediate7 />, <Intermediate8 />, <Intermediate9 />, <Intermediate10 />,
  ],
  advanced: [
    <Advanced1 />, <Advanced2 />, <Advanced3 />, <Advanced4 />, <Advanced5 />,
    <Advanced6 />, <Advanced7 />, <Advanced8 />, <Advanced9 />, <Advanced10 />,
  ],
};
