

function renderClassCard(course) {
    return `<div id="classCard" class="classCard">
                <h1 class="courseName">COMP ${course.number}: ${course.title}</h1>
                <p class="description">${course.description}</p>
                <h4 class="stats">${course.likes} Likes | ${course.dislikes} Dislikes</h4>
                <button onclick="dislike(${course.id})" class="swipeLeft" type="button"><i class="fa fa-thumbs-down"></i></button>
                <button onclick="like(${course.id})" class="swipeRight" type="button"><i class="fa fa-thumbs-up"></i></button></br>
                <div class="comment">Leave a comment:</div>
                <textarea id="commentText"></textarea></br>
                <button class="sendComment" type="submit" onclick="comment(${course.id})">Send</button>
                <button class="btn"><i class="fa fa-close"></i></button>
            </div>`;
};

function renderCourseComments(course) {
    //TODO: request to get comments for the specific course
    return `<div id="courseComments" class="courseComments">
                <h3 class="center">Your Classmates' Thoughts on this Course:</h3>
                <h1>${course.id}</h1>
            </div>`;
};

function loadClassIntoDOM(course) {
    let $root = $('#classCard');
    let courseCard = renderClassCard(course);
    $root.replaceWith(courseCard);
};

function loadCommentsIntoDOM(course) {
    let $root = $('#courseComments');
    let commentsCard = renderCourseComments(course);
    initMap(course);
    $root.replaceWith(commentsCard);
}

async function deleteAcc(event) {

    axios.delete('localhost:300/account/' + $username); 
}

async function like(prevIndex) {
    let cur = 0; 
    if (prevIndex == 20) {
        cur = 0;  
    } else {
        cur = prevIndex + 1;
    }
    loadClassIntoDOM(classData[cur]);
    loadCommentsIntoDOM(classData[cur]);
let currLikes = 0; 
     let r = await axios.get('http://localhost:3000/public/cards/' + classData[prevIndex].number + '/likes').then((response) => {
        currLikes = response.data.result 
    });
     axios.post('http://localhost:3000/public/cards/' + classData[prevIndex].number + '/likes',
        {
        data: currLikes + 1,
    }).then(response => {
        classData[prevIndex].likes = currLikes + 1;
    }).catch(error => {
        console.log(error);
    });
 
}


async function dislike(prevIndex) {
    let cur = 0; 
    if (prevIndex == 20) {
        cur = 0;  
    } else {
        cur = prevIndex + 1;
    }
    loadClassIntoDOM(classData[cur]);
    loadCommentsIntoDOM(classData[cur]);
    //TODO: request to update the number of dislikes
    let currDislikes = 0; 
     let r = await axios.get('http://localhost:3000/public/cards/' + classData[prevIndex].number + '/dislikes').then((response) => {
        console.log(response);
        currDisikes = response.data.result
    });


     axios.post('http://localhost:3000/public/cards/' + classData[prevIndex].number + '/dislikes',
        {
        data: currDislikes + 1,
    }).then(response => {
        classData[prevIndex].dislikes = currDislikes + 1;
    }).catch(error => {
        console.log(error);
    });;

};

function comment(courseID) {
    let text = document.getElementById("commentText").value;
    console.log(text);
    document.getElementById("commentText").value = "";
    //TODO: request to add comment 
}
async function updateAll () {
    for (let i = 0; i < 21; i++) {
        let r = axios.get('http://localhost:3000/public/cards/' + classData[i].number + '/dislikes').then((response) => {
            console.log(response);
            classData[i].dislikes = response.data.result
        });
        let x = axios.get('http://localhost:3000/public/cards/' + classData[i].number + '/likes').then((response) => {
            console.log(response);
            classData[i].likes = response.data.result
        });
}
}

$(function() {
    updateAll();
    loadClassIntoDOM(classData[0]);
    loadCommentsIntoDOM(classData[0]);
});

var map;
function initMap(course) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.9132, lng: -79.055},
    zoom: 15
  });
var marker = new google.maps.Marker({position: course.location, map: map});
}
