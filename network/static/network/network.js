document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#all_posts').addEventListener('click',(e) => {
                                             e.preventDefault();
	                                         get_info('all_posts');
	                                                });
  document.querySelector('#user').addEventListener('click', (e) => {
                                                                 e.preventDefault();
	                                                             get_info('page');
	                                                              });
  document.querySelector('#following').addEventListener('click',(e) => {
                                                                    e.preventDefault();
                                                                    get_info('following');
	                                                                  });
  document.querySelector('#sent_post').onclick =  function(e) {
                                                        e.preventDefault();
                                                        console.log('Click en post');
                                                        sent_post()
                                                         };
  
  // By default
  get_info('all_posts');
});

function get_info(section){
    const main = document.querySelector('#main');
    main.innerHTML = `${section}`;
    console.log(section);
    fetch(`/${section}`)
    .then(response => response.json())
    .then(data => {
                    console.log(data);
                    if (section != 'page'){
                                        data.forEach(post => show_posts(post));
                                        }
                    else { 
                           page_user(data);
                          }                    
                    })
    .catch(error => {
                    console.error('Error:', error);
                    alert('The data could not be obtained.Try again.');
                    });
    }
function show_posts(post){
                    const main = document.querySelector('#main');
                    const one_post = document.createElement('div');
                    one_post.className = 'border';
                    one_post.innerHTML =`<div> <a href=# data-user_id=${post.id} class='user_link'  >${post.user}</a> <div> ${post.date}</div></div>
                                         ${post.is_owner ? '<button> Edit </button>' : ''}
                                         <div>${post.body}</div>
                                         <div>${post.likes}</div>`;
                    main.append(one_post);
                    one_post.addEventListener('click', (e) =>{
                                                         if(e.target.classList.contains('user_link')){
                                                                                                main.innerHTML='';
                                                                                                e.preventDefault();
                                                                                                const user = e.target.dataset.user_id;
                                                                                                fetch(`/page/${user}`)
                                                                                                .then(response => response.json())
                                                                                                .then(data => {
                                                                                                               if(user == post.id ){
                                                                                                                                   page_user(data);  
                                                                                                                                     }
                                                                                                               else {                     
                                                                                                               page_user(data,true);}
                                                                                                               });
                                                            
                                                                                                    }
                                                            } );                   
                     
                     }
function page_user(data, visitor = false){
                        info_user = data.pop();
                        const main = document.querySelector('#main');
                        const info = document.createElement('div');
                        info.className= 'border';
                        info.innerHTML = `<div> <strong> User: </strong> ${info_user.username}</div>
                                          <div> <strong> Following: </strong> ${info_user.following} </div>
                                          <div> <strong> Followers </strong> ${info_user.followers} </div>
                                          ${visitor ? '<button class="btn btn-primary">Follow</button>' :''} `;
                        main.append(info);                        
                        data.forEach(post => show_posts(post));
                        
                        }                     
function sent_post(){
    const body = document.querySelector('#post-body').value;
    fetch('/post', {
                    method:'POST',
                    body: JSON.stringify({body:body
                                          })
                    })
    .then(response => response.json())
    .then(result => {console.log(result)})
    .catch(error => {
        console.error('Error:', error);
        alert('The post could not be sent. Try again.');
        });
    }
