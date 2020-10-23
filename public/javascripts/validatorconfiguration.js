(function(){
    'use strict';
    
    $(document).ready(function(){
  
        let form = $('.bootstrap-form');
  
        // On form submit take action, like an AJAX call
      $(form).submit(function(e){
  
          if(this.checkValidity() == false) {
              $(this).addClass('was-validated');
              e.preventDefault();
              e.stopPropagation();
              return;
          }
  
      });
  
      // On every :input focusout validate if empty
      $(':input').blur(function(){
          let fieldType = this.type;
  
          switch(fieldType){
              case 'textarea':
                  validateTextArea($(this));
                  break;
              case 'text':
                  validateText($(this));
                  break;
              default:
                  break;
          }
      });
  
  
      // On every :input focusin remove existing validation messages if any
      $(':input').click(function(){
  
          $(this).removeClass('is-valid is-invalid');
  
      });
  
      // On every :input focusin remove existing validation messages if any
      $(':input').keydown(function(){
  
          $(this).removeClass('is-valid is-invalid');
  
      });
  
  
    });
  
      // Validate Text and password
      function validateTextArea(thisObj) {
          let fieldValue = thisObj.val();
          if(fieldValue.length > 1 && fieldValue.length < 500) {
              $(thisObj).addClass('is-valid');
          } else {
              $(thisObj).addClass('is-invalid');
          }
      }
      function validateText(thisObj) {
        let fieldValue = thisObj.val();
        if(fieldValue.length > 1 && fieldValue.length < 255) {
            $(thisObj).addClass('is-valid');
        } else {
            $(thisObj).addClass('is-invalid');
        }
    }
  
  })();
  