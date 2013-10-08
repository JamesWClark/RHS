using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace Yearbook_Photos {
    public partial class Main : Form {
        public Main() {
            InitializeComponent();
        }

        private void Main_Load(object sender, EventArgs e) {

            //network connection may not be available, try

                //connect to a main directory

                //the main directory has directories for every year

                    //make a drop down list for sub directories of the main directory

                    //sort top of list by most recently modified directory

                //every year has additional directories if new data is added

                //every directory has an IDLINK.TXT file

                //create the master record for list view

                //for every directory in the top year do

                    //process the IDLINK.TXT as a CSV file
    
                        //CSV columns: StudentID, PictureFile, FirstName, Grade, LastName, StudentID, Homeroom#

                            //example: "1234","1234.jpg","CLARK","10","JAMES","1234","107"

                //populate list view based on master record: list view: lastname, firstname, grade

            //catch exception

            //some additional events to handle:

                //search
                
                //show selected picture

                //export

                //sort by list view column

            string directory = @"C:\Users\jwclark\Desktop\New folder";
            string[] files = Directory.GetFiles(directory, "*.jpg");

            /*
            foreach (string path in files) {
                ListViewItem listItem = new ListViewItem(
                lvCurrent.Items.Add(key);
                Image image = Image.FromFile(path);
            }
             * */
        }

        private void lvCurrent_SelectedIndexChanged(object sender, EventArgs e) {
            string path = lvCurrent.SelectedItems[0].Text;
            Image image = Image.FromFile(path);
            pnlImage.BackgroundImage = image;
        }
    }
}
