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
                                         ${post.is_owner ? '<button data-post_id=${post.post_id} class="btn_edit"> Edit </button>' : ''}
                                         <div class= "body">${post.body}</div>
                                         <button class='btn_liked'> ${ post.user_liked ? '️♥️' : '🤍'} ${post.likes}</button>`;
                    main.append(one_post);
                    one_post.addEventListener('click', (e) =>{
                                                         if(e.target.classList.contains('user_link')){
                                                                                                main.innerHTML='';
                                                                                                e.preventDefault();
                                                                                                const user = e.target.dataset.user_id;
                                                                                                fetch(`/page/${user}`)
                                                                                                .then(response => response.json())
                                                                                                .then(data => {
                                                                                                               page_user(data)
                                                                                                               });
                                                            
                                                                                                    };
                                                         if (e.target.classList.contains('btn_edit')) { console.log('click on edit');
                                                                                                        e.preventDefault();
                                                                                                        e.target.style.display = 'none';
                                                                                                        edit_post(one_post.querySelector('.body'), post.post_id, e.target);
                                                                                                        }; 
                                                            
                                                         if (e.target.classList.contains('btn_liked')){
                                                                                                        console.log('click on like');
                                                                                                        };   
                                                            } );                   
                     
                     }
function page_user(data){
                        console.log(data);
                        info_user = data[1];
                        console.log(info_user);
                        console.log(data);
                        const main = document.querySelector('#main');
                        const info = document.createElement('div');
                        info.className= 'border';
                        info.innerHTML = `<div> <strong> User: </strong> ${info_user.username}</div>
                                          <div> <strong> Following: </strong> ${info_user.following} </div>
                                          <div> <strong> Followers </strong> ${info_user.followers} </div>
                                          `;
                       if(info_user.relation != 'Self' ){
                          const btn_follow = document.createElement('button');
                          btn_follow.className = `${info_user.relation == 'Not Following' ? 'btn btn-outline-primary btn_follow' : 'btn btn-primary btn_follow'}`;
                          btn_follow.textContent = `${info_user.relation == 'Not Following' ? 'Follow': 'Following'}`;
                          info.appendChild(btn_follow);                  
                          };                   
                                          
                       info.addEventListener('click', function (e) {
                                                                    if (e.target.classList.contains('btn_follow')){
                                                                                                                   console.log(`${info_user.id}`);
                                                                                                                   fetch(`/follow/${info_user.id}`, { method:`${info_user.relation == 'Not Following' ? 'POST': 'DELETE'}` })
                                                                                                                   .then(r => r.json())
                                                                                                                   .then(data => console.log(data.message));
                                                                                                                   btn_follow = document.querySelector('.btn_follow')
                                                                                                                   btn_follow.textContent = info_user.relation == 'Not Following'? 'Following' : 'Follow' ;
                                                                                                                   btn_follow.className = info_user.relation == 'Not Following' ? 'btn btn-primary btn_follow' : 'btn btn-outline-primary btn_follow';
                                                                                                                   info_user.relation = info_user.relation === 'Not Following'? 'Following' : 'Not Following' ;
                                                                                                               };
                                                                    });
                        main.append(info);                        
                        data[0].forEach(post => show_posts(post));
                        
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
function edit_post(post, id, edit_button){
    const body = post.textContent ; 
    post.innerHTML =` <form id="edit-form">
                          <textarea class="form-control" id="edit-body" rows="3" > ${body} </textarea>
                         <button type="submit" class="btn btn-primary mt-2" id='edit_post'>Edit</button>
                      </form>`;
      
    document.querySelector('#edit-form').addEventListener('submit', function(e){
                                                e.preventDefault();
                                                const new_body = document.querySelector('#edit-body').value.trim() ;
                                                console.log(new_body);
                                                fetch('/edit', {
                                                                method: 'POST',
                                                                body: JSON.stringify({body:new_body, id:id})
                                                                })
                                                .then(response => response.json())
                                                .then(result => {console.log(result);
                                                                 edit_button.style.display = 'block';
                                                                 post.innerHTML = result.body;
                                                                })
                                                .catch(error => {console.error('Error:', error);
                                                                 alert('The post could not be edit. Try again.');
                                                                });
                                                       }
                                                );
    }
