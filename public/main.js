const updateButton = document.querySelector("#update")
const deleteButton = document.querySelector("#delete")
 

updateButton.addEventListener( "click", _ => {
    var option = {memberId: document.querySelector("#id")}
    fetch("/list" ,{
        method: "put",
        headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: document.querySelector("#name"),
            gender: document.querySelector('input[name="gender"]'),
            yearOfBirth: document.querySelector("#yearOfBirth"),
            memberId: document.querySelector("#id"),
            personalTraining: document.querySelector('input[name="personalTraining"]'),
            facility: {
                locker: document.querySelector('input[name="locker"]'),
                poor: document.querySelector('input[name="poor"]'),
                shower: document.querySelector('input[name="shower"]')
            }
        })
        
    }).then(res => {
        if (res.ok) return res.json()
        
    })
    .then(response => {
        window.location.reload(true)
        
    })
    
})

deleteButton.addEventListener("click", _ => {
    
    fetch('/list', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            memberId: document.querySelector("#id").value  
        })
        
    }).then(res => {
        if (res.ok) return res.json()
      })
      .then(response => {
        if (response === 'No quote to delete') {
          console.log("no")
        } else {
          //window.location.reload(true)
          
        }
        
      })
      .catch(console.error)
})



