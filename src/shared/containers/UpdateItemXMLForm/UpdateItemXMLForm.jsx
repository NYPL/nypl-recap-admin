
const UpdateItemXMLForm = () => (
  <form>
    <label for='barcodes'>Barcodes</label><textarea id='barcodes'></textarea>
    <label for='preserve-gcd'>Preserve GCD</label>
    <div id='preserve-gcd'>
      <input type='radio' name='preserve-gcd' value='Yes'/>
      <input type='radio' name='preserve-gcd' value='No'/>
    </div>
    <input type='submit'/>
  </form>
)
  

