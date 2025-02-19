class Css {
    table = {
        position: "fixed",
        left: "1200px",
        top: "50px",
        cursor: "grab",
        userSelect: "none",
        zIndex: "1"
    };

    timeCellDouble = {
        backgroundColor: "grey",
        color: "white"
    };

    timeCell = {
        border: "1px solid black",
        paddingRight: "10px",
        backgroundColor: "white"
    };

    courseCell = {
        border: "1px solid black",
        paddingLeft: "10px",
        paddingRight: "10px"
    };

    //----------

    menuButton = {
        position: "fixed",
        top: "0px",
        right: "0px",
        width: "25px",
        height: "25px",
        borderRadius: "5px",
        backgroundColor: "cyan",
        border: "1px solid black",
        textAlign: "center",
        fontSize: "20px",
        cursor: "pointer"
    };

    menuBackground = {
        position: "fixed",
        top: "50%",
        left: "50%",
        width: "100%",
        height: "100%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(128, 128, 128, 0.5)",
        display: "none",
        zIndex: "2"
    };

    menu = {
        position: "fixed",
        top: "50%",
        left: "50%",
        width: "80%",
        height: "80%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        display: "flex",
        overflow: "auto",
        justifyContent: "space-between"
    };

    courseMenu = {
        width: "30%",
        margin: "10px",
        borderRight: "1px solid black"
    };

    courseScheduleTableMenu = {
        width: "60%",
        margin: "10px"
    }

    courseDragList = {
        margin: "10px",
        overflow: "auto",
        height: "60%"
    };

    courseScheduleTable = {
        borderCollapse: "collapse",
        maxHeight: "80%",
        width: "80%"
    };

    courseScheduleCell = {
        border: "1px solid black",
        borderCollapse: "collapse",
        minHeight: "20px",
        height: "20px"
    }
}

const css = new Css()

function addCss(element, style) {
    for (let key of Object.keys(style)) {
        element.style[key] = style[key];
    }
}

function readAllCourse() {
    let result = [];
    let allCourse = document.getElementsByClassName("ic-DashboardCard")

    for (let course of allCourse) {
        let c = []
        c.push(course.getAttribute("aria-label"))
        c.push(course.getElementsByClassName("ic-DashboardCard__link")[0].href.split("/")[4])
        result.push(c)
    }

    return result
}

function br() {
    return document.createElement("br")
}

function updateCoursePreview(element) {
    let course = getCourseFromForm()


    element.style.backgroundColor = course.color;
    if (course.whiteText) {
        element.style.color = "white";
    } else {
        element.style.color = "black";
    }

    let innerHTML = course.name
    if (course.classroom !== "") {
        innerHTML += "<br>" + course.classroom
    }
    element.innerHTML = innerHTML;

    if (course.courseId != -1) {
        element.style.cursor = "pointer"
        element.classList.add("timeTableCourseButton");
    }

    addCss(element, css.courseCell);
}

function loadCourseList() {
    let result = localStorage["courseList"]
    if (!result) {
        return []
    } else {
        return JSON.parse(result)
    }
}

function saveCourseList(newList) {
    localStorage["courseList"] = JSON.stringify(newList)
}

function getCourseFromForm() {
    let name = document.getElementById("nameInput").value
    if (!name) {
        name = "Course Nickname"
    }

    let classroom = document.getElementById("classroomInput").value
    if (!classroom) {
        classroom = "";
    }

    let courseId = document.getElementById("courseIdInput").value
    if (isNaN(courseId) || !courseId) {
        courseId = -1;
    } else {
        courseId = parseInt(courseId)
    }

    let color = document.getElementById("courseColorInput").value

    let whiteText = document.getElementById("courseWhiteTextInput").checked

    return {"name": name, "classroom": classroom, "courseId": courseId, "color": color, "whiteText": whiteText}
}

function generateCourseDragCell(course, element) {
    let div = document.createElement("div");
    div.draggable = true
    div.ondragstart = (ev) => {ev.dataTransfer.setData("text", `${course.courseId}@${course.index}`)};
    div.style.fontSize = "10px"
    div.style.width = "75px"

    div.style.backgroundColor = course.color;
    if (course.whiteText) {
        div.style.color = "white";
    }

    let innerHTML = `<span style="font-size: 15px;">${course.name}</span>`
    if (course.classroom !== "") {
        innerHTML += "<br>" + course.classroom
    }
    
    if (course.courseId != -1) {
        innerHTML += " | " + course.courseId
    }
    
    div.innerHTML = innerHTML;
    addCss(div, css.courseCell);
    div.style.display = "inline-block";

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "X"
    deleteButton.style.display = "inline-block";
    deleteButton.style.verticalAlign = "middle";

    let main = document.createElement("div")
    main.appendChild(div)
    main.appendChild(deleteButton)

    deleteButton.addEventListener("click", (e) => {
        let courseList = loadCourseList()
        let i = course.index
        courseList.splice(i, 1)
        for (let c of courseList) {
            if (c.index > i) {
                c.index -= 1
            }
        }
        saveCourseList(courseList)
        updateCourseDragList(element)

        let courseSchedule = loadCourseSchedule()
        for (let d = 0; d < 5; d++) {
            let day = courseSchedule[d]
            for (let cell = 0; cell < day.length; cell++) {
                if (courseSchedule[d][cell] > i) {
                    courseSchedule[d][cell] -= 1
                } else if (courseSchedule[d][cell] === i) {
                    courseSchedule[d][cell] = -1
                }
            }
        }
        saveCourseSchedule(courseSchedule)
        updateCourseSchedule(document.getElementById("csTable"))
    })

    return main
}

function updateCourseDragList(element) {
    element.innerHTML = ""
    let courseList =  loadCourseList();

    for (c of courseList) {
        element.appendChild(generateCourseDragCell(c, element))
    }
}

function loadCourseSchedule() {
    let cs = localStorage.courseSchedule
    if (!cs) {
        return [
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1]]
    }
    return JSON.parse(cs)
}

function saveCourseSchedule(newCS) {
    localStorage.courseSchedule = JSON.stringify(newCS)
}

function courseScheduleCellOnDrop(e) {
    e.preventDefault()
    let data = e.dataTransfer.getData("text").split("@")
    let indexs = e.target.getAttribute("data-cellindex").split("@")

    let courseSchedule = loadCourseSchedule()
    courseSchedule[indexs[0]][indexs[1]] = Number(data[1])
    saveCourseSchedule(courseSchedule)

    updateCourseSchedule(document.getElementById("csTable"))
}

function updateCourseSchedule(tableEle) {
    tableEle.innerHTML = ""
    
    let colGroup = document.createElement("colgroup")
    let col = document.createElement("col")
    col.span = 5
    col.style.width = "20%"
    colGroup.appendChild(col)
    tableEle.appendChild(colGroup)

    let cs = loadCourseSchedule()
    let courseList = loadCourseList()
    maxLen = Math.max(cs[0].length, cs[1].length, cs[2].length, cs[3].length, cs[4].length);

    let head = document.createElement("tr")
    let weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    for (let i = 0; i < 5; i++) {
        let w = weekdays[i]
        let th = document.createElement("th");

        let plusButton = document.createElement("button")
        plusButton.innerText = "+"
        plusButton.style.display = "inline-block"
        th.appendChild(plusButton)

        plusButton.addEventListener("click", (e) => {
            let courseSchedule = loadCourseSchedule()
            courseSchedule[i].push(-1)
            saveCourseSchedule(courseSchedule)
            updateCourseSchedule(tableEle)

            let timeTable = loadTimeTable()
            timeTable[i].push("")
            saveTimeTable(timeTable)
            updateTimeTable(document.getElementById("timeTable"))
        })
        

        let minusButton = document.createElement("button")
        minusButton.innerText = "-"
        minusButton.style.display = "inline-block"
        th.appendChild(minusButton)

        minusButton.addEventListener("click", (e) => {
            let courseSchedule = loadCourseSchedule()
            courseSchedule[i].pop()
            saveCourseSchedule(courseSchedule)
            updateCourseSchedule(tableEle)

            let timeTable = loadTimeTable()
            timeTable[i].pop()
            saveTimeTable(timeTable)
            updateTimeTable(document.getElementById("timeTable"))
        })

        th.appendChild(br())
        th.appendChild(document.createTextNode(w))

        addCss(th, css.courseScheduleCell)
        head.appendChild(th)
    }

    tableEle.appendChild(head)
    

    for (let i = 0; i < maxLen; i++) {
        let tr = document.createElement("tr")
        for (let d = 0; d < cs.length; d++) {
            let day = cs[d]
            let td = document.createElement("td")

            if (i <= day.length-1) {
                td.style.backgroundColor = day[i] == -1? "" : courseList[day[i]].color
                td.innerText = day[i] == -1? "" : courseList[day[i]].name
                td.style.color = day[i] == -1? "" : courseList[day[i]].whiteText? "white" : "black"
                td.setAttribute("data-cellIndex", `${d}@${i}`)
                td.setAttribute("data-backgroundColor", td.style.backgroundColor)

                td.ondragover = (e) => {e.preventDefault();e.stopPropagation();}
                td.ondrop = (e) => {courseScheduleCellOnDrop(e)}

                td.ondragenter = (e) => {e.target.style.backgroundColor = "grey"}
                td.ondragleave = (e) => {e.target.style.backgroundColor = e.target.getAttribute("data-backgroundColor")}

                td.addEventListener("click", (e) => {
                    if (document.getElementById("deleteMode").getAttribute("data-deleteMode") === "off") {
                        return
                    }

                    let courseSchedule = loadCourseSchedule()
                    courseSchedule[d][i] = -1
                    saveCourseSchedule(courseSchedule)
                    updateCourseSchedule(tableEle)
                })

                addCss(td, css.courseScheduleCell)
            }

            tr.appendChild(td)
        }
        tableEle.appendChild(tr)
    }
}

function loadTimeTable() {
    let timeTable = localStorage.timeTable
    let courseSchedule = loadCourseSchedule()
    if (!timeTable) {
        timeTable = [[], [], [], [], []]
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j <= courseSchedule[i].length; j++) {
                timeTable[i].push("")
            }
        }
        return timeTable
    }
    return JSON.parse(timeTable)
}

function saveTimeTable(newTable) {
    localStorage.timeTable = JSON.stringify(newTable)
}

function updateTimeTable(tableEle) {
    let csTable = document.getElementById("csTable")

    let courseSchedule = loadCourseSchedule()

    tableEle.innerHTML = ""

    let colGroup = document.createElement("colgroup")
    let col = document.createElement("col")
    col.span = 5
    col.style.width = "20%"
    colGroup.appendChild(col)
    tableEle.appendChild(colGroup)

    let timeTable = loadTimeTable()
    maxLen = Math.max(timeTable[0].length, timeTable[1].length, timeTable[2].length, timeTable[3].length, timeTable[4].length);

    let head = document.createElement("tr")
    let startTimes = [timeTable[0][0], timeTable[1][0], timeTable[2][0], timeTable[3][0], timeTable[4][0]]

    let menuBackground = document.getElementById("menuBackground")

    let thRowHeight, tdRowHeight
    let menuBackgroundDisplay = menuBackground.style.display
    let csTableDisplay = csTable.style.display
    let sampleThRow = csTable.querySelector("tr")
    let sampleTdRow = csTable.querySelectorAll("tr")[1]
    let thRowComputedStyle = window.getComputedStyle(sampleThRow)
    let tdRowComputedStyle = window.getComputedStyle(sampleTdRow)
    
    menuBackground.style.display = "block"
    csTable.style.display = "table"

    thRowHeight = sampleThRow.getBoundingClientRect().height - parseFloat(thRowComputedStyle.borderTopWidth) - parseFloat(thRowComputedStyle.borderBottomWidth);
    thRowHeight = thRowHeight + "px"

    tdRowHeight = sampleTdRow.getBoundingClientRect().height - parseFloat(tdRowComputedStyle.borderTopWidth) - parseFloat(tdRowComputedStyle.borderBottomWidth);
    tdRowHeight = tdRowHeight + "px"

    menuBackground.style.display = menuBackgroundDisplay
    csTable.style.display = csTableDisplay

    for (let i = 0; i < 5; i++) {
        let time = startTimes[i]
        let th = document.createElement("th");

        let plusButton = document.createElement("button")
        plusButton.innerText = "+"
        th.appendChild(plusButton)

        plusButton.addEventListener("click", (e) => {
            let courseSchedule = loadCourseSchedule()
            courseSchedule[i].push(-1)
            saveCourseSchedule(courseSchedule)
            let timeTable = loadTimeTable()
            timeTable[i].push("")
            saveTimeTable(timeTable)
            updateCourseSchedule(csTable)
            updateTimeTable(tableEle)
        })

        let minusButton = document.createElement("button")
        minusButton.innerText = "-"
        th.appendChild(minusButton)

        minusButton.addEventListener("click", (e) => {
            let courseSchedule = loadCourseSchedule()
            courseSchedule[i].pop()
            saveCourseSchedule(courseSchedule)

            let timeTable = loadTimeTable()
            timeTable[i].pop()
            saveTimeTable(timeTable)

            updateCourseSchedule(csTable)
            updateTimeTable(tableEle)
        })

        th.appendChild(br())
        
        let input = document.createElement("input")
        input.maxLength = 6
        input.value = time
        input.style.width = "80%"
        input.style.maxHeight = "15px"

        input.addEventListener("change", (e) => {
            let timeTable = loadTimeTable()
            timeTable[i][0] = input.value
            saveTimeTable(timeTable)
        })

        th.appendChild(input)

        addCss(th, css.courseScheduleCell)
        th.style.height = ""
        head.appendChild(th)
    }

    head.height = thRowHeight

    tableEle.appendChild(head)
    
    for (let i = 1; i <= maxLen; i++) {
        let tr = document.createElement("tr")
        for (let d = 0; d < timeTable.length; d++) {
            let td = document.createElement("td")

            if (courseSchedule[d][i-1] != undefined) {
                let input = document.createElement("input")
                input.maxLength = 6
                input.value = timeTable[d][i]
                input.style.width = "80%"
                input.style.height = "15px"

                input.addEventListener("change", (e) => {
                    let timeTable = loadTimeTable()
                    timeTable[d][i] = input.value
                    saveTimeTable(timeTable)
                })

                addCss(td, css.courseScheduleCell)
                td.style.textAlign = "center"

                td.appendChild(input)
            }

            tr.appendChild(td)
        }
        tr.style.height = tdRowHeight
        tableEle.appendChild(tr)
    }
}

function constructMenu() {
    let menuButton = document.createElement("div");
    addCss(menuButton, css.menuButton);
    menuButton.innerText = "≡";
    document.getElementById("header").appendChild(menuButton);

    let menuBackground = document.createElement("div");
    menuBackground.id = "menuBackground"
    addCss(menuBackground, css.menuBackground);
    document.getElementById("header").appendChild(menuBackground);

    document.addEventListener("keydown", (e) => {
        if (e.key == "Escape") {
            menuBackground.style.display = "none";
        }
    })

    let menu = document.createElement("div");
    addCss(menu, css.menu);
    menuBackground.appendChild(menu);

    menuButton.addEventListener("click", (e) => {
        menuBackground.style.display = "block";
    });

    menuBackground.addEventListener("click", (e) => {
        if (e.target == e.currentTarget) {
            menuBackground.style.display = "none";
        }
    });

    let courseMenu = document.createElement("div");
    addCss(courseMenu, css.courseMenu);
    menu.appendChild(courseMenu);

    let h = document.createElement("h1");
    h.innerText = "Course"
    courseMenu.appendChild(h);

    let addCourseButton = document.createElement("button");
    addCourseButton.innerText = "Add Course";
    courseMenu.appendChild(addCourseButton)

    courseMenu.appendChild(br())

    let courseDragListTitle = document.createElement("h3");
    courseDragListTitle.innerText = "Course List"
    courseMenu.appendChild(courseDragListTitle)

    let courseDragList = document.createElement("div");
    addCss(courseDragList, css.courseDragList);
    courseMenu.appendChild(courseDragList)
    updateCourseDragList(courseDragList)

    let addCourseMenu = document.createElement("form");
    addCourseMenu.style.display = "none";
    courseMenu.appendChild(addCourseMenu)

    addCourseButton.addEventListener("click", (e) => {
        addCourseMenu.style.display = addCourseMenu.style.display == "none" ? "block" : "none"
        addCourseButton.innerText = addCourseButton.innerText == "Add Course" ? "Back" : "Add Course"

        courseDragListTitle.style.display = courseDragListTitle.style.display == "none" ? "block" : "none"
        courseDragList.style.display = courseDragList.style.display == "none" ? "block" : "none"
    });


    let nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "nameInput");
    nameLabel.innerText = "Nickname"
    addCourseMenu.appendChild(nameLabel);

    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "nameInput";
    nameInput.style.padding = "0";
    addCourseMenu.appendChild(nameInput);


    addCourseMenu.appendChild(br());


    let classroomLabel = document.createElement("label")
    classroomLabel.setAttribute("for", "classroomInput");
    classroomLabel.innerText = "Classroom"
    addCourseMenu.appendChild(classroomLabel);

    let classroomInput = document.createElement("input");
    classroomInput.type = "text";
    classroomInput.id = "classroomInput";
    classroomInput.style.padding = "0";
    addCourseMenu.appendChild(classroomInput);


    addCourseMenu.appendChild(br());


    let courseIdLabel = document.createElement("label");
    courseIdLabel.setAttribute("for", "courseIdInput");
    courseIdLabel.innerText = "ID";
    addCourseMenu.appendChild(courseIdLabel);

    let courseIdInput = document.createElement("input");
    courseIdInput.type = "text";
    courseIdInput.id = "courseIdInput";
    courseIdInput.style.padding = "0";
    addCourseMenu.appendChild(courseIdInput);

    let courseIdOption = document.createElement("datalist");
    courseIdOption.id = "courseIdOption"
    addCourseMenu.appendChild(courseIdOption);
    courseIdInput.setAttribute("list", "courseIdOption")

    setTimeout(() => {
        for (let c of readAllCourse()) {
            let o = document.createElement("option");
            o.value = c[1]
            o.label = c[0]
            courseIdOption.appendChild(o)
        }
    }, 1000)

    addCourseMenu.appendChild(br());

    let courseColorLabel = document.createElement("label");
    courseColorLabel.setAttribute("for", "courseColorInput");
    courseColorLabel.innerText = "Color";
    addCourseMenu.appendChild(courseColorLabel);

    let courseColorInput = document.createElement("input");
    courseColorInput.type = "color";
    courseColorInput.id = "courseColorInput";
    courseColorInput.value = "#ffffff"
    courseColorInput.style.padding = "0";
    addCourseMenu.appendChild(courseColorInput);


    addCourseMenu.appendChild(br());


    let courseWhiteTextLabel = document.createElement("label");
    courseWhiteTextLabel.setAttribute("for", "courseWhiteTextInput");
    courseWhiteTextLabel.innerText = "White Text";
    addCourseMenu.appendChild(courseWhiteTextLabel);

    let courseWhiteTextInput = document.createElement("input");
    courseWhiteTextInput.type = "checkbox";
    courseWhiteTextInput.id = "courseWhiteTextInput";
    addCourseMenu.appendChild(courseWhiteTextInput);


    addCourseMenu.appendChild(br());


    let courseSubmitButton = document.createElement("button");
    courseSubmitButton.innerText = "Confirm";
    addCourseMenu.appendChild(courseSubmitButton);

    addCourseMenu.appendChild(br());

    let coursePreview = document.createElement("div");
    coursePreview.style.marginTop = "10px";
    coursePreview.style.width = "50%";
    addCourseMenu.appendChild(coursePreview);
    updateCoursePreview(coursePreview)

    addCourseMenu.addEventListener("input", (e) => {
        updateCoursePreview(coursePreview);
    })

    courseSubmitButton.addEventListener("click", (e) => {
        e.preventDefault()

        let courseList = loadCourseList();

        let list = getCourseFromForm()
        list.index = courseList.length

        courseList.push(list);
        saveCourseList(courseList);

        addCourseMenu.reset();
        courseColorInput.value = "#ffffff"
        updateCoursePreview(coursePreview)
        updateCourseDragList(courseDragList)
    });

    //------------------------Course Schedule------------------------

    let csTableMenu = document.createElement("div");
    addCss(csTableMenu, css.courseScheduleTableMenu)
    menu.appendChild(csTableMenu)

    let deleteMode = document.createElement("button");
    deleteMode.id = "deleteMode"
    deleteMode.innerText = "Delete Mode: Off"
    deleteMode.setAttribute("data-deleteMode", "off")
    deleteMode.addEventListener("click", (e) => {
        if (deleteMode.getAttribute("data-deleteMode") === "off") {
            deleteMode.setAttribute("data-deleteMode", "on")
            deleteMode.innerText = "Delete Mode: On"
            deleteMode.style.backgroundColor = "red"
            deleteMode.style.color = "white"
            return
        }
        deleteMode.setAttribute("data-deleteMode", "off")
        deleteMode.innerText = "Delete Mode: Off"
        deleteMode.style.backgroundColor = ""
        deleteMode.style.color = "black"
    });
    
    let switchButton = document.createElement("button")
    switchButton.innerText = "Switch Table"
    switchButton.addEventListener("click", (e) => {
        csTable.style.display = csTable.style.display === "none"? "table" : "none"
        deleteMode.style.display = deleteMode.style.display === "none"? "inline-block" : "none"
        timeTable.style.display = timeTable.style.display === "none"? "table" : "none"
        updateCourseSchedule(csTable)
        updateTimeTable(timeTable)
    })
    csTableMenu.appendChild(switchButton)
    
    csTableMenu.appendChild(deleteMode)

    let csTable = document.createElement("table");
    csTable.id = "csTable"
    addCss(csTable, css.courseScheduleTable)
    csTableMenu.appendChild(csTable);
    updateCourseSchedule(csTable);


    let timeTable = document.createElement("table");
    timeTable.id = "timeTable";
    timeTable.style.display = "none"
    addCss(timeTable, css.courseScheduleTable);
    csTableMenu.appendChild(timeTable);
    updateTimeTable(timeTable)
}

(function(){
    const weekDay = new Date(Date.now()).getDay() - 1;

    // Menu
    constructMenu()

    if (weekDay < 0 || weekDay > 4) {
        return
    }

    let timeTable = loadCourseSchedule()[weekDay]
    let times = loadTimeTable()[weekDay]
    let courseList = loadCourseList()

    let table = document.createElement("table");

    addCss(table, css.table)

    let tbody = document.createElement("tbody");

    for (let i = 0; i < timeTable.length; i++) {
        let tr = document.createElement("tr");

        let t = document.createElement("td");
        addCss(t, css.timeCell);

        let startTime = times[i] === "" ? "XX:XX" : times[i].replace("d", "")
        let endTime = times[i+1] === "" ? "XX:XX" : times[i+1]
        let time = startTime + " - " + endTime

        if (time[time.length-1] === "d") {
            addCss(t, css.timeCellDouble);
            time = time.substring(0, time.length-1);
        }

        t.innerText = time;

        let course = courseList[timeTable[i]]
        let c = document.createElement("td");

        if (course) {
            c.style.backgroundColor = course.color;
            if (course.whiteText) {
                c.style.color = "white";
            }

            let innerHTML = course.name
            if (course.classroom !== "") {
                innerHTML += "<br>" + course.classroom
            }
            c.innerHTML = innerHTML;

            if (course.courseId != -1) {
                let link = "https://stjohnsgs.instructure.com/courses/" + course.courseId.toString()
                c.addEventListener("click", function () {
                    window.location.href = link
                });
                c.style.cursor = "pointer"
                c.classList.add("timeTableCourseButton");
            }
        } else {
            c.style.backgroundColor = "white"
            c.innerText = "Free"
        }

        addCss(c, css.courseCell);

        tr.appendChild(t);

        tr.appendChild(c);

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    document.getElementById("header").appendChild(table);

    // -----------------------------------

    // Load pos
    let pos = localStorage.timeTablePos
    if (pos) {
        pos = pos.split("@")

        let l = pos[0];
        let t = pos[1];

        l = Math.max(0, Math.min(window.innerWidth - table.clientWidth, l));
        t = Math.max(0, Math.min(window.innerHeight - 400, t));

        table.style.left = l + "px";
        table.style.top = t + "px";
    }

    let isDragging = false;

    let offsetX = 0, offsetY = 0;

    // Dragable time table
    table.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("timeTableCourseButton")) {
            return
        }

        isDragging = true;

        offsetX = e.clientX - table.offsetLeft;
        offsetY = e.clientY - table.offsetTop;

        table.style.cursor = "grabbing"

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            let l = e.clientX - offsetX
            let t = e.clientY - offsetY

            l = Math.max(0, Math.min(window.innerWidth - table.clientWidth, l));
            t = Math.max(0, Math.min(window.innerHeight - table.clientHeight, t));

            table.style.left = l + "px";
            table.style.top = t + "px";

            if (typeof(Storage) !== "undefined") {
                localStorage.timeTablePos = l + "@" + t
            }
        }
    }

    function onMouseUp(e) {
        isDragging = false;

        table.style.cursor = "grab";

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }
})();
