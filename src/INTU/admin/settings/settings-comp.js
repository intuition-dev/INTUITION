
riot.tag2('settings-comp', '<form class="grid-form settings-form" id="settings-form"> <fieldset> <div data-row-span="1"> <div data-field-span="1"> <label>EmailJS <b>service_id <div class="subtitle">it can be found on \'Email Services\' tab of your EmailJs account</div></b></label> <input type="text" name="emailjsService_id" riot-value="{(typeof this.emailjsService_id !=\'undefined\') ? this.emailjsService_id : \'\'}"> </div> </div> <div data-row-span="1"> <div data-field-span="1"> <label>EmailJS <b>template_id <div class="subtitle">it can be found on \'Email Templates\' tab of your EmailJs account (create a template if there isn\'t one)</div></b></label> <input type="text" name="emailjsTemplate_id" riot-value="{(typeof this.emailjsTemplate_id !=\'undefined\') ? this.emailjsTemplate_id : \'\'}"> </div> </div> <div class="mb-2" data-row-span="1"> <div data-field-span="1"> <label>EmailJS <b>user_id <div class="subtitle">it can be found on \'Account\' tab --> \'Api keys\' in your EmailJs account</div></b></label> <input type="text" name="emailjsUser_id" riot-value="{(typeof this.emailjsUser_id !=\'undefined\') ? this.emailjsUser_id : \'\'}"> </div> </div> <button class="btn-custom btn-primary mt-2" id="save-settings">Save Settings</button> </fieldset> </form>', '', '', function(opts) {
    var _this = this
    this.emailjsService_id = opts.emailjsService_id
    this.emailjsTemplate_id = opts.emailjsTemplate_id
    this.emailjsUser_id = opts.emailjsUser_id
    this.bindSetup = opts.bindSetup

    this.on('mount', function(){
       $('#save-settings').on('click', function(ev){
          ev.preventDefault()
          var serialize = $('#settings-form').serializeArray()
          _this.bindSetup.saveConfig(serialize)
          console.log("TCL: saving settings, serialize", serialize)
       })
    })
});