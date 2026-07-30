document.addEventListener('DOMContentLoaded', function() {

  
  document.querySelector('#all_posts').addEventListener('click',(e) => {
                                             e.preventDefault();
                                             document.querySelector('#post-form').style.display='block';
	                                         get_info('all_posts');
	                                                });
  document.addEventListener('click', (e) => {
                                            const userLink = e.target.closest('#user');
                                            if(userLink){
                                                                 e.preventDefault();
                                                                 document.querySelector('#post-form').style.display='none';
	                                                             get_info('profile');
	                                                      }
                                            });
  document.addEventListener('click',(e) => {
                                            const followingLink = e.target.closest('#following');
                                            if (followingLink){
                                                                    e.preventDefault();
                                                                    document.querySelector('#post-form').style.display='none';
                                                                    get_info('following');
	                                                           }       
                                            });
  const sent_post_btn = document.querySelector('#sent_post')
  if(sent_post_btn){
                   sent_post_btn.onclick =  function(e) {
                                                        e.preventDefault();
                                                        console.log('Click en post');
                                                        sent_post();
                                                        get_info('all_posts');
                                                        };
                    };
 
  get_info('all_posts');
});

function get_info(section, page=1){
    const main = document.querySelector('#main');
    main.innerHTML = '';
    console.log(section);
    fetch(`/${section}?page=${page}`)
    .then(response => response.json())
    .then(data => {
                    console.log(data);
                    if (section === 'all_posts' || section === 'following'){
                                        data.posts.forEach(post => show_posts(post));
                                        pagination(section, data.pagination);
                                        }
                    else { 
                           page_user(data);
                           pagination(section, data.pagination);
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
                                         ${post.is_owner ? `<button data-post_id=${post.post_id} class="btn_edit"> Edit </button>` : ''}
                                         <div class= "body">${post.body}</div>
                                         <button class='btn_liked' data-liked =${ post.user_liked}> ${ post.user_liked ? '️♥️' : '🤍'} <span class="likes-count">${post.likes}</span></button>`;
                    main.append(one_post);
                    one_post.addEventListener('click', (e) =>{
                                                         if(e.target.classList.contains('user_link')){
                                                                                                e.preventDefault();
                                                                                                document.querySelector('#post-form').style.display='none';
                                                                                                main.innerHTML='';
                                                                                                const user = e.target.dataset.user_id;
                                                                                                fetch(`/profile/${user}`)
                                                                                                .then(response => response.json())
                                                                                                .then(data => {
                                                                                                               page_user(data)
                                                                                                               pagination(`profile/${user}`, data.pagination)
                                                                                                               });
                                                            
                                                                                                    };
                                                         if (e.target.classList.contains('btn_edit')) { console.log('click on edit');
                                                                                                        e.preventDefault();
                                                                                                        e.target.style.display = 'none';
                                                                                                        document.querySelectorAll('.btn_edit').forEach( btn => {
                                                                                                                                                btn.disabled = true;}
                                                                                                                                                      );
                                                                                                        edit_post(one_post.querySelector('.body'), post.post_id, e.target);
                                                                                                        }; 
                                                            
                                                         if (e.target.closest('.btn_liked') &&  document.querySelector('#user') ){ 
                                                                                                        console.log('click on like');
                                                                                                        like_post(e.target.closest('.btn_liked'),post.post_id);
                                                                                                        };   
                                                            } );                   
                     
                     }
function page_user(data){
                        info_user = data.user_info;
                        console.log('info');
                        console.log(info_user);
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
                        data.posts.forEach(post => show_posts(post));
                        
                        }                     
function sent_post(){
    const body = document.querySelector('#post-body').value;
    fetch('/post', {
                    method:'POST',
                    body: JSON.stringify({body:body
                                          })
                    })
    .then(response => response.json())
    .then(result => {console.log(result);
                     document.querySelector('#post-body').value = '';
                    })
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
                                                                 document.querySelectorAll('.btn_edit').forEach( btn => {
                                                                                                        btn.disabled = false;}
                                                                                                               );
                                                                })
                                                .catch(error => {console.error('Error:', error);
                                                                 alert('The post could not be edit. Try again.');
                                                                });
                                                       }
                                                );
    }
function like_post(button, id){
                            const isLiked = button.dataset.liked === 'true';
                            const countSpan = button.querySelector('.likes-count');
                            let count = parseInt(countSpan.textContent);
                            console.log(button);
                            if (isLiked) {
                                        count--;
                                        button.dataset.liked = 'false';
                                        button.innerHTML = `🤍 <span class="likes-count">${count}</span>`;
                                        } 
                            else {
                                count++;
                                button.dataset.liked = 'true';
                                button.innerHTML = `♥️ <span class="likes-count">${count}</span>`;
                                }
                            fetch(`/like/${id}`, {method: 'POST'})
                            .then(response => response.json())
                            .then(data => {
                                            const serverLiked = data.liked;
                                            const serverCount = data.likes_count;
                                                                                        
                                            const currentLiked = button.dataset.liked === 'true';
                                            const currentCount = parseInt(button.querySelector('.likes-count').textContent, 10);

                                            if (serverLiked !== currentLiked || serverCount !== currentCount) {
                                                button.dataset.liked = String(serverLiked);
                                                button.innerHTML = `${serverLiked ? '♥️' : '🤍'} <span class="likes-count">${serverCount}</span>`;
                                                                                                                }
                                           })
                            .catch(error => {
                                            console.error('Error processing like:', error);
                                            alert('The like could not be updated. Please try again.');
                                            });
                             }
function pagination(section, info_page) {
                    const  div_pagination = document.querySelector('#pagination');
                    div_pagination.innerHTML = '';
                    
                    const ul = document.createElement('ul');
                    ul.className = 'pagination justify-content-center';
                    ul.innerHTML = `  <li class = "${info_page.has_previous ? 'page-item' : 'page-item disabled'}"> <a class='page-link previous' href='#'>Previous </a></li>
                                      <li class = "${info_page.has_next ? 'page-item' : 'page-item disabled'}"> <a class='page-link next' href='#'> Next </a></li>`;
                    div_pagination.append(ul);
                    div_pagination.style.display = info_page.total_pages > 1 ? 'block' : 'none' ;
                    ul.addEventListener('click', (e) => {
                                                        e.preventDefault();
                                                        if(e.target.closest('.previous')){
                                                                                                   get_info(section, info_page.previous_page);
                                                                                                   console.log('click previous');
                                                                                                    };
                                                        if(e.target.closest('.next')){
                                                                                                   get_info(section, info_page.next_page); 
                                                                                                   console.log('click next');
                                                                                                    };                                           
                                                        } )     
                        }
                         
                                                 
