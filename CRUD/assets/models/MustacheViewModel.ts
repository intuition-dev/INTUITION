interface iVM {
   // list or array or set
   // object
   getViewList(name?: string): any

}

class MustacheViewModel {
   exampleModel: any
   _data: object[] = []
   dataSourceType: string = 'real'  //real or fake

   getViewList(div) {

      switch (div) {
         case 'target':
            // let data = new Collections.Dictionary()
            // this._data.map(function (object) {
            //    data.setValue('article', object)

            // })
            // console.info("--data:", data)
            return this._data
      }
   }

   read() {
      let _this = this
      var url = 'https://newsapi.org/v2/top-headlines?' +
         'sources=bbc-news&' +
         'apiKey=c75812bea33d40efb539400d39f99c32';
      var req = new Request(url);

      return fetch(req)
         .then(function (response) {
            if (response.status === 200) {
               return response.json();
            } else {
               throw new Error('Something went wrong on api server!');
            }
         })
         .then(function (response) {
            _this._data = [].concat(response.articles)
            console.info("--response.articles:", response)
            return
         })
      //maybe other read methods from a diffrent entity
   }
}