
var getPostByFetchJson = async (url,data=null) => {
    try{
        let config = null;
        if(data != null){
            config = {
                method : "POST",
                body : JSON.stringify(data),
                headers : {
                    "content-type" : "application/json; charset=UTF-8"
                }
            }
        }
        let response = await fetch(url, config);
        if(response.ok){
            return await response.json();
        }else{
            return response ;
        }
    }catch(e){
        console.log(e);
    }
};

var getByXHRJson = (url)=>{
    return new Promise((resolve, reject) => {
        try{
            let xhr = new XMLHttpRequest();
            xhr.open("GET",url,true);
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4 ){
                    if(xhr.status === 200){
                        let data = JSON.parse(xhr.response)  ;
                        resolve(data) ;
                    }else{
                        reject(xhr.response);
                    }
                }
            };
            xhr.send(null);
        }catch(e){
            console.log(e);
        }
    })
};

var getUserById = async (userId)=>{
    return await getByXHRJson('http://sp1b.gaido.fr/users/'+userId)
};

function getRandomUserId(min, max) {
    return Math.floor(Math.random() * (max - min) + min );
}

const user = getRandomUserId(1,10);
var userContainer = document.getElementById("user");
var postsContainer = document.getElementById('posts');
var btnDisplayPosts = document.getElementById('btn-display-posts');

getUserById(user).then((userInfos)=>{
    var content = document.createTextNode(`${userInfos.username} ${userInfos.name} ${userInfos.email} ${userInfos.phone}`);
    userContainer.appendChild(content);
}).catch((error)=>{
   console.log(error);
});



var getPostsByUserId = async (userId)=>{
    return await getPostByFetchJson('http://sp1b.gaido.fr/posts/?userId='+userId);
};

btnDisplayPosts.addEventListener('click', function(){
    getPostsByUserId(user).then((posts)=>{
        let nbPost = posts.length;
        for(let i= 0 ; i< nbPost ; i++ ){
            setTimeout(function(){
                let divPost =  document.createElement('div');
                let divTitle = document.createElement('div');
                let divBody = document.createElement('div');
                let title = document.createTextNode(`${posts[i].title}`);
                let body = document.createTextNode(`${posts[i].body}`);
                divTitle.appendChild(title);
                divBody.appendChild(body);
                divPost.appendChild(divTitle );
                divPost.appendChild(divBody);
                postsContainer.appendChild(divPost);
            },200 * i);
        }
    }).catch((error)=>{
        console.log(error);
    });
});

