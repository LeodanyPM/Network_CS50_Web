document.addEventListener('DOMContentLoaded', function() {
 
  
  document.querySelector('#all_posts').addEventListener('click',(e) => {
                                             e.preventDefault();
                                             const userLink = document.querySelector('#user');
                                             if(userLink){
                                                       document.querySelector('#post-form').style.display='block';
                                                          };
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
                                                        console.log('Click sent post');
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
                    if (section === 'all_posts' || section === 'following'){
                                        if(data.posts.length === 0) {
                                            main.className = 'text-center';
                                            main.innerHTML = '<p class="display-1 text-muted text-center mb-3">📦</p>';
                                            pagination(section, data.pagination);                        
                                                                    }
                                            
                                        else {
                                            data.posts.forEach(post => show_posts(post));
                                            pagination(section, data.pagination);}
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
                    one_post.innerHTML =`<div> <a href=# data-user_id=${post.id} class='user_link'  ><i class="bi bi-person-circle me-1"></i>${post.user}</a> 
                                         <div> ${post.date}</div></div>
                                         <div class= "body">${post.body}</div>
                                         <button class='btn_liked' data-liked =${ post.user_liked}> ${ post.user_liked ? '️♥️' : '🤍'} <span class="likes-count">${post.likes}</span></button>
                                         ${post.is_owner ? `<button data-post_id=${post.post_id} class="btn_edit"  title="Edit"> <i class="bi bi-pencil-square text-primary me-2"></i> </button>` : ''}`;
                    main.append(one_post);
                    one_post.addEventListener('click', (e) =>{
                                                         const  user_link = e.target.closest('.user_link')
                                                         if(user_link){
                                                                                                e.preventDefault();
                                                                                                const curren_userLink = document.querySelector('#user');
                                                                                                if(curren_userLink){
                                                                                                            document.querySelector('#post-form').style.display='none';
                                                                                                                   };
                                                                                                main.innerHTML='';
                                                                                                const user = user_link.dataset.user_id;
                                                                                                fetch(`/profile/${user}`)
                                                                                                .then(response => response.json())
                                                                                                .then(data => {
                                                                                                               page_user(data)
                                                                                                               pagination(`profile/${user}`, data.pagination)
                                                                                                               });
                                                            
                                                                                                    };
                                                         if (e.target.closest('.btn_edit')) {           console.log('click on edit');
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
                        const main = document.querySelector('#main');
                        const info = document.createElement('div');
                        info.className= 'user-profile';
                        info.innerHTML = `<div class="profile-name">
                                            <i class="bi bi-person-circle"></i> ${info_user.username}
                                        </div>
                                        <div class="profile-stats">
                                            <span class="stat">${info_user.following} <small>Following</small></span>
                                            <span class="stat"><span id="followers">${info_user.followers}</span> <small>Followers</small></span>
                                        </div>`;
                       if(info_user.relation == 'Not Following' || info_user.relation == 'Following'  ){
                          const btn_follow = document.createElement('button');
                          btn_follow.className = `${info_user.relation == 'Not Following' ? 'btn btn-outline-primary btn_follow btn-sm' : 'btn btn-primary btn-sm btn_follow'}`;
                          btn_follow.textContent = `${info_user.relation == 'Not Following' ? 'Follow': 'Following'}`;
                          info.querySelector('.profile-stats').appendChild(btn_follow);                 
                          };                   
                                          
                       info.addEventListener('click', function (e) {
                                                                    if (e.target.classList.contains('btn_follow')){
                                                                                                                   fetch(`/follow/${info_user.id}`, { method:`${info_user.relation == 'Not Following' ? 'POST': 'DELETE'}` })
                                                                                                                   .then(r => r.json())
                                                                                                                   .then(data => console.log(data.message));
                                                                                                                   btn_follow = document.querySelector('.btn_follow');
                                                                                                                   btn_follow.textContent = info_user.relation == 'Not Following'? 'Following' : 'Follow' ;
                                                                                                                   btn_follow.className = info_user.relation == 'Not Following' ? 'btn btn-primary btn_follow btn-sm' : 'btn btn-outline-primary btn_follow btn-sm';
                                                                                                                   const count_follwers = parseInt(document.querySelector('#followers').textContent);
                                                                                                                   document.querySelector('#followers').textContent = info_user.relation == 'Not Following' ? count_follwers + 1 : count_follwers - 1;
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
                         <button type="submit" class="btn btn-primary btn-sm mt-2" id='edit_post'>
                         <i class="bi bi-check-lg me-1"></i>Save</button>
                      </form>`;
      
    document.querySelector('#edit-form').addEventListener('submit', function(e){
                                                e.preventDefault();
                                                const new_body = document.querySelector('#edit-body').value.trim() ;
                                                fetch('/edit', {
                                                                method: 'POST',
                                                                body: JSON.stringify({body:new_body, id:id})
                                                                })
                                                .then(response => response.json())
                                                .then(result => {
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
                    ul.innerHTML = `  <li class = "${info_page.has_previous ? 'page-item' : 'page-item disabled'}"> <a class='page-link previous' href='#'>
                                                    <i class="bi bi-chevron-left me-1"></i>Previous </a></li>
                                      <li class = "${info_page.has_next ? 'page-item' : 'page-item disabled'}"> <a class='page-link next' href='#'> 
                                                    Next<i class="bi bi-chevron-right ms-1"></i> </a></li>`;
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
                         
                                                 
