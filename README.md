# Timetable
JavaScript script that can add a fully funtional timetable to Stjohns Gramma School's Canvas page
Design for Stjohns Gramma School's Canvas homepage, but should also work on other pages or sites as well

- [Feature](#feature)
- [How to Install](#how-to-install)
  - [Chrome](#chrome)
  - [FireFox (WIP)](#firefox)
  - [Microsoft Edge (WIP)](#microsoft-edge)
  - [Safari (WIP)](#safari)
- [How to Use](#how-to-use)
  - [Time Table](#time-table)
  - [Menu](#menu)
    - [Course Menu](#course-menu)
    - [Course Schedule](#course-schedule)
- [CSS](#css)
- [Version History](#version-history)
  - [1.2](#12)
  - [1.1](#11)

## Feature
- Draggable timetable that remember where it was 👍 (don't worry, it will not disapper outside your screen)
- Cool-looking config and setup menu 👍 (thanks for google chrome's default display style, didn't tested on other browsers yet)
- Easy to use 👍 (will take some time to understand how to use)
- Powerful timetable editor 👍 (do what ever you want to your timetable!)
- HE**-like code management and structure 👎
- Custom style supported for the timetable 👍 (make it larger, change color, remove border, you name it)

## How to Install
### Chrome
Refferr to [https://www.tampermonkey.net/faq.php?locale=en#Q102]
### Firefox
WIP, but should be similar to Chrome, you can also choose Greasemonkey if you want
### Microsoft Edge
WIP, but should be similar to Chrome
### Safari
WIP, but should be similar to Chrome

## How to Use
### Time Table
- By default, a double lesson's time cell will have a grey background color
- You can drag it and place it
- If it gose out of bounds for some reason, it will automatically move back to the edge 
### Menu
- After installed, you should be able to see a blue icon at the top-right corner. Click on it will bring up the menu
- The button aside can hide or show the timetable
#### Course Menu
- At the left side is the course menu, you can add and delete course here
- When adding course, Nickname and Classroom will be display in the actual timetable, Color determind its background color, and having a Id will lead you to the course's mainpage when you click on that cell. A preview will be shown at the bottom when you filling informations. **All informations are not required**
- After confirm, hit "Back", then you should be able to see that course at the bottom (with a X on side, you can click that X to delete this course)
#### Course Schedule
- At the right side you could see your course schedule for the whole week
- You can drag course from the course menu to a cell. You could also use the + and - button at the top of each weekday to add or take one cell from this day
- Enable delete mode by the bottom at the top, after enable you can remove a course from course schedule by click on them
- Every cell include one input box for time. The input box underneath weekdays are the **start time** of the day, and every other input box represent the **end time** of that class. If the corrsponding class is a double lesson, put a "d" after the end time

## CSS
Basically every CSS used in this script has been put at the top of it, so you can change that freely if you want (by "basically" I mean full support for the draggable time table, and half support for the menu)

## Version History
### 1.2
- Added Hide/Show button
### 1.1
- Merged Course Schedule and Time Table
