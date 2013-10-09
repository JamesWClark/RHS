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
            try {

                //connect to a main directory
                string rootPath = @"C:\LocalStorage\static";

                //the main directory has directories for every year
                string[] yearFolders = Directory.GetDirectories(rootPath);

                //make a drop down list for sub directories of the main directory
                SetDropDownOptions(rootPath, yearFolders);

                //every year has additional directories if new data is added
                foreach (string s in yearFolders) {
                    string[] subFolders = Directory.GetDirectories(s);
                    foreach (string subFolder in subFolders) {
                        //for every directory in the top year do
                        //every directory has an IDLINK.TXT file
                        string[] linkFiles = Directory.GetFiles(subFolder, "IDLINK.TXT");
                        //create the master record for list view
                        //process the IDLINK.TXT as a CSV file
                        foreach (string csv in linkFiles) {
                            StreamReader reader = new StreamReader(csv);
                            while (!reader.EndOfStream) {
                                string line = reader.ReadLine();
                                //CSV columns: StudentID, PictureFile, FirstName, Grade, LastName, StudentID, Homeroom#
                                //example: "1234","1234.jpg","CLARK","10","JAMES","1234","107"
                                string[] columns = line.Split(',');
                                ListViewItem item = new ListViewItem(columns[2].Replace("\"", string.Empty));
                                item.SubItems.Add(columns[4].Replace("\"", string.Empty));
                                item.SubItems.Add(columns[3].Replace("\"", string.Empty));
                                lvCurrent.Items.Add(item);
                            }
                        }
                    }
                }

                //populate list view based on master record: list view: lastname, firstname, grade

                //catch exception
            } catch {

            }

            //some additional events to handle:

                //search
                
                //show selected picture

                //export

                //sort by list view column

            /*
            string directory = @"C:\Users\jwclark\Desktop\New folder";
            string[] files = Directory.GetFiles(directory, "*.jpg");

            
            foreach (string path in files) {
                ListViewItem listItem = new ListViewItem(
                lvCurrent.Items.Add(key);
                Image image = Image.FromFile(path);
            }
             * */
        }
        private void SetDropDownOptions(string rootPath, string[] yearFolders) {
            foreach (string s in yearFolders) {
                comboYear.Items.Add(s.Replace(rootPath + @"\", String.Empty));
            }

            //sort top of list by most recently modified directory
            if (comboYear.Items.Count > 0) {
                DateTime newest = new DateTime();
                foreach (string s in yearFolders) {
                    DateTime creationTime = Directory.GetCreationTime(s);
                    if (creationTime > newest) {
                        comboYear.SelectedIndex = 0;
                    }
                }
            }
        }
        /*
        private void lvCurrent_SelectedIndexChanged(object sender, EventArgs e) {
            string path = lvCurrent.SelectedItems[0].Text;
            Image image = Image.FromFile(path);
            pnlImage.BackgroundImage = image;
        }
         * */
    }
}
