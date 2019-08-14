upload(req, res,(error) => {
    if(error){
       res.redirect('/?msg=3');
    }else{
      if(req.file == undefined){
        
        res.redirect('/?msg=2');
      }else{
           
          /**
           * Create new record in mongoDB
           */
          var fullPath = "files/"+req.file.filename;
          var document = {
            path:     fullPath, 
            caption:   req.body.caption
          };

        var photo = new Photo(document); 
        photo.save(function(error){
          if(error){ 
            throw error;
          } 
          res.redirect('/?msg=1');
       });
    }
  }
});