//performance on list views is rough
//try to fix with http://stackoverflow.com/questions/6089674/whats-better-to-use-a-datagrid-or-listview-for-displaying-large-amounts-of-dat

using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using System.Windows.Forms;

namespace Yearbook_Photos {
    public partial class Main : Form {

        private const string VERSION = "1.0";
        private const string rootPath = @"G:\YearbookPhotos"; //@"C:\LocalStorage\static";
        private string[] yearFolders;
        private ListViewColumnSorter sorter;

        public Main() {
            InitializeComponent();


            //XDocument xdoc = XDocument.Load("settings");
            //rootPath = xdoc.Descendants("rootPath").First().Value;
        }
        private void Main_Load(object sender, EventArgs e) {
            sorter = new ListViewColumnSorter();
            lvCurrent.ListViewItemSorter = sorter;
            lvExport.ListViewItemSorter = sorter;

            try {
                //the main directory has directories for every year
                yearFolders = Directory.GetDirectories(rootPath);
                //make a drop down list for sub directories of the main directory
                SetDropDownOptions(rootPath, yearFolders);
                //drop down options called SetLists(), so the lists are full now
            } catch (DirectoryNotFoundException) {
                string error = "Your G: drive is not connected, or you do not have permission to view the G: drive yearbook photos.";
                string caption = "G: Drive Unavailable";
                MessageBox.Show(error, caption, MessageBoxButtons.OK, MessageBoxIcon.Error);
                Application.Exit(new CancelEventArgs(true));
            }
        }
        private void SetLists() {
            //network connection may not be available, try
            try {     

                string selectedYear = rootPath + @"\" + comboYear.SelectedItem;

                //every year has additional directories if new data is added

                string[] subFolders = Directory.GetDirectories(selectedYear);
                foreach (string subFolder in subFolders) {
                    //for every directory in the top year do
                    //every directory has an IDLINK.TXT file
                    string[] linkFiles = Directory.GetFiles(subFolder, "IDLINK.TXT");
                    //create the master record for list view
                    //process the IDLINK.TXT as a CSV file
                    foreach (string csv in linkFiles) {
                        StreamReader reader = new StreamReader(csv);
                        while (!reader.EndOfStream) {
                            //CSV columns: StudentID, PictureFile, FirstName, Grade, LastName, StudentID, Homeroom#
                            //example: "1234","1234.jpg","CLARK","10","JAMES","1234","107"
                            string line = reader.ReadLine();
                            string[] values = line.Split(',');
                            //populate list view based on master record: list view: lastname, firstname, grade, id
                            ListViewItem item = new ListViewItem(values[4].Replace("\"", string.Empty)); //last name
                            item.SubItems.Add(values[2].Replace("\"", string.Empty)); //first name
                            item.SubItems.Add(values[3].Replace("\"", string.Empty).TrimStart(new char[] { '0' })); //grade
                            item.SubItems.Add(values[0].Replace("\"", string.Empty)); //id
                            item.ImageKey = subFolder;
                            lvCurrent.Items.Add(item);
                        }
                    }
                }

                //show initial picture
                if (lvCurrent.Items.Count > 0) {
                    lvCurrent.Sort();
                    lvCurrent.Items[0].Selected = true;
                }

                //catch exception

            } catch (Exception ex) {
                lblStub.Text = ex.Message;
            }
        }

        private void SetDropDownOptions(string rootPath, string[] yearFolders) {
            ArrayList items = new ArrayList();
            foreach (string s in yearFolders) {
                items.Add(s);

            }
            items.Reverse();
            foreach (string s in items) {
                comboYear.Items.Add(s.Replace(rootPath + @"\", String.Empty));
            }
            comboYear.SelectedIndex = 0;
        }

        private void lv_ColumnClick(object sender, ColumnClickEventArgs e) {
            ListView listView = (ListView)sender;
            if (e.Column == sorter.SortColumn) {
                if (sorter.Order == SortOrder.Ascending) {
                    sorter.Order = SortOrder.Descending;
                } else {
                    sorter.Order = SortOrder.Ascending;
                }
            } else {
                sorter.SortColumn = e.Column;
                sorter.Order = SortOrder.Ascending;
            }
            listView.Sort();
        }
        private void lvCurrent_SelectedIndexChanged(object sender, EventArgs e) {

        }

        private void btnAdd_Click(object sender, EventArgs e) {
            ListView.SelectedListViewItemCollection items = lvCurrent.SelectedItems;
            

            foreach (ListViewItem item in lvCurrent.SelectedItems) {
                lvCurrent.Items.Remove(item);
                lvExport.Items.Add(item);
            }

            if (lvExport.Items.Count > 0) {
                btnExport.Enabled = true;
            }
        }

        private void btnRemove_Click(object sender, EventArgs e) {
            foreach (ListViewItem item in lvExport.SelectedItems) {
                lvExport.Items.Remove(item);
                lvCurrent.Items.Add(item);
            }

            if (lvExport.Items.Count == 0) {
                btnExport.Enabled = false;
            }

            lvCurrent.Sort();
        }

        private void btnExport_Click(object sender, EventArgs e) {
            FolderBrowserDialog fbd = new FolderBrowserDialog();
            DialogResult result = fbd.ShowDialog();
            if (result == DialogResult.Cancel) {
                //do nothing, cancel was clicked
            } else if (fbd.SelectedPath != null) {
                if (Directory.GetFiles(fbd.SelectedPath).Length == 0) {
                    int count = 0;
                    foreach (ListViewItem item in lvExport.Items) {
                        try {
                            string source = item.ImageKey + @"\" + item.SubItems[3].Text + ".jpg";
                            string destination = fbd.SelectedPath + @"\"
                                + item.SubItems[1].Text + "-"       //firstname
                                + item.Text + "-"                   //last name
                                + item.SubItems[2].Text + "-"       //grade
                                + item.SubItems[3].Text             //ID
                                + ".jpg";
                            File.Copy(source, destination);
                            count++;
                        } catch (Exception) {
                            //skip that one, probably an IOException due to file exists already
                            //HOWEVER, 2013-14 missed 1 file
                        }
                    }
                    MessageBox.Show("Copied " + count + " picture" + (count == 1 ? "." : "s."));
                } else {
                    string error = "Files exist in the folder you selected.\n\nPlease create or select an empty folder and try again.";
                    string caption = "Choose an Empty Folder";
                    MessageBox.Show(error, caption, MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void txtSearch_KeyPress(object sender, KeyPressEventArgs e) {
            if (e.KeyChar == (char)13) {
                e.Handled = true;
                lvCurrent.Focus();
                foreach (ListViewItem item in lvCurrent.SelectedItems) {
                    item.Selected = false;
                }
                try {
                    lvCurrent.FindItemWithText(txtSearch.Text).Selected = true;
                    lvCurrent.TopItem = lvCurrent.SelectedItems[0];
                } catch (NullReferenceException) {
                    lblSearchMessage.Text = "A match was not found.";
                }
            }
        }

        private void txtSearch_Click(object sender, EventArgs e) {
            lblSearchMessage.Text = string.Empty;
            txtSearch.SelectionStart = 0;
            txtSearch.SelectionLength = txtSearch.Text.Length;
        }

        private void comboYear_SelectedIndexChanged(object sender, EventArgs e) {
            lvCurrent.Items.Clear();
            lvExport.Items.Clear();
            SetLists();
        }

        private void lvCurrent_ItemSelectionChanged(object sender, ListViewItemSelectionChangedEventArgs e) {
            if (e.IsSelected) {
                try {
                    string path = e.Item.ImageKey + @"\"
                        + e.Item.SubItems[3].Text + ".jpg";
                    Image image = Image.FromFile(path);
                    pnlImage.Image = image;
                } catch {

                }
            }
        }

        private void lvExport_ItemSelectionChanged(object sender, ListViewItemSelectionChangedEventArgs e) {
            if (e.IsSelected) {
                try {
                    string path = e.Item.ImageKey + @"\"
                        + e.Item.SubItems[3].Text + ".jpg";
                    Image image = Image.FromFile(path);
                    pnlImage.Image = image;
                } catch {

                }
            }
        }
        /*
        private void btnSelectAll_lvCurrent_Click(object sender, EventArgs e) {
            lvCurrent.Focus();
            foreach (ListViewItem item in lvCurrent.Items) {
                item.Selected = true;
            }
        }

        private void btnSelectAll_lvExport_Click(object sender, EventArgs e) {
            lvExport.Focus();
            foreach (ListViewItem item in lvExport.Items) {
                item.Selected = true;
            }
        }
         * */

        private void lvCurrent_KeyDown(object sender, KeyEventArgs e) {
            if (e.KeyCode == Keys.A && e.Control) {
                foreach (ListViewItem item in lvCurrent.Items) {
                    item.Selected = true;
                }
            }
        }

        private void lvExport_KeyDown(object sender, KeyEventArgs e) {
            if (e.KeyCode == Keys.A && e.Control) {
                foreach (ListViewItem item in lvExport.Items) {
                    item.Selected = true;
                }
            }
        }

        private void lblStub_MouseEnter(object sender, EventArgs e) {
            lblStub.Text = "Yearbook Photos v " + VERSION + " authored by J.W. Clark for Rockhurst High School";
        }

        private void lblStub_MouseLeave(object sender, EventArgs e) {
            lblStub.Text = "v " + VERSION;
        }
    }
}
