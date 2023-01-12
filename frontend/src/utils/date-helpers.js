export const formatDate = (inputDate) => {
    if(typeof inputDate === 'string') {
        inputDate = new Date(inputDate);
    }

    if(inputDate instanceof Date) {
        let date, month, year;
  
        date = inputDate.getDate();
        month = inputDate.getMonth() + 1;
        year = inputDate.getFullYear();
      
        date = date
            .toString()
            .padStart(2, '0');
    
        month = month
            .toString()
            .padStart(2, '0');

        
        let resultString = "";

        if(!isNaN(date) && !isNaN(month) && !isNaN(year)) {
            resultString = `${month}/${date}/${year}`;
        }
      
        return resultString;
    }
    else {
        return (new Date(0)).toDateString();
    }
}