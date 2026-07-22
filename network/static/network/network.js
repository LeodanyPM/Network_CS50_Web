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
  
  // By default
  all_posts('Posts');
});

function all_posts(section){
    const main = document.querySelector('#main')
    main.innerHTML = `${section}`;
    console.log(section);
    }
