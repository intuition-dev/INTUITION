
riot.tag2('settings-comp', '<form class="grid-form" id="settings-form"> <fieldset> <div data-row-span="1"> <div data-field-span="1"> <label>Add Path to existed site</label> <input type="text" name="path" riot-value="{(typeof this.pathToSite !=\'undefined\') ? this.pathToSite : \'\'}"> </div> </div> <div data-row-span="1"> <div data-field-span="1"> <label>App is running on port:</label> <input type="text" name="port" riot-value="{(typeof this.port !=\'undefined\') ? this.port : \'\'}"> </div> </div> <button class="btn mt-2" id="save-settings">Save Settings</button> </fieldset> </form>', '', '', function(opts) {
    var _this = this
    this.pathToSite = opts.pathToSite
    this.port = opts.port
    this.bindSetup = opts.bindSetup

    this.on('mount', function(){
       $('#save-settings').on('click', function(ev){
          ev.preventDefault()
          var serialize = $('#settings-form').serializeArray()
          _this.bindSetup.saveConfig(serialize)
          console.log("TCL: serialize", serialize)
       })
    })
});