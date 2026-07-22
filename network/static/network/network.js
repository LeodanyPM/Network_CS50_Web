document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#all_posts').addEventListener('click',(e) => {
                                             e.preventDefault();
	                                         all_posts('Posts');
	                                                });
  document.querySelector('#user').addEventListener('click', (e) => {
                                                                 e.preventDefault();
	                                                             all_posts('User');
	                                                              });
  document.querySelector('#following').addEventListener('click',(e) => {
                                                                    e.preventDefault();
                                                                    all_posts('Following');
	                                                                  });
  document.querySelector('#sent_post').onclick =  function(e) {
                                                        e.preventDefault();
                                                        console.log('Click en post');
                                                        sent_post()
                                                         };
  
  // By default
  all_posts('Posts');
});

function all_posts(section){
    const main = document.querySelector('#main')
    main.innerHTML = `${section}`;
    console.log(section);
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
